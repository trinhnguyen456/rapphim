'use strict';

const crypto = require('node:crypto');
const {
  hashPassword, verifyPassword, userView, createSession, getCurrentUser, destroySession,
  verifyCsrf, ensureCsrfCookie,
} = require('./security');
const { dateInVietnam, timeInVietnam } = require('../db/seed');

const MAX_BODY_BYTES = 64 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAY_METHODS = new Set(['Ví MoMo / QR Cinetix', 'ATM nội địa', 'Thẻ quốc tế']);

class HttpError extends Error {
  constructor(status, message, code = 'request_failed') { super(message); this.status = status; this.code = code; }
}

const REQUEST_LIMITS = Object.freeze({ login: 300, register: 100, booking: 100 });

async function enforceSharedRateLimit(pool, scope) {
  const limit = REQUEST_LIMITS[scope];
  if (!Object.hasOwn(REQUEST_LIMITS, scope) || !limit) throw new Error('Unknown Cinetix request rate-limit scope.');
  await pool.execute(
    `INSERT INTO request_rate_limits (scope_key,window_started,attempts) VALUES (?,UTC_TIMESTAMP(3),1)
     ON DUPLICATE KEY UPDATE
       attempts=IF(window_started < DATE_SUB(UTC_TIMESTAMP(3),INTERVAL 15 MINUTE),1,attempts+1),
       window_started=IF(window_started < DATE_SUB(UTC_TIMESTAMP(3),INTERVAL 15 MINUTE),UTC_TIMESTAMP(3),window_started)`,
    [scope]);
  const [[bucket]] = await pool.execute('SELECT attempts FROM request_rate_limits WHERE scope_key=?', [scope]);
  if (Number(bucket?.attempts || 0) > limit) {
    const message = {
      register: 'Đang có quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 15 phút.',
      booking: 'Đang có quá nhiều yêu cầu đặt vé. Vui lòng thử lại sau 15 phút.',
      login: 'Đang có quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau 15 phút.',
    }[scope];
    throw new HttpError(429, message, 'rate_limited');
  }
}

function sendJson(response, status, value, extraHeaders = {}) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  response.end(body);
}

async function readJson(request) {
  if (!String(request.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Yêu cầu phải gửi JSON.', 'json_required');
  }
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, 'Nội dung gửi lên vượt quá giới hạn.', 'body_too_large');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpError(400, 'JSON không hợp lệ.', 'invalid_json'); }
}

function cleanString(value, label, max = 200, required = true) {
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null)) return '';
    throw new HttpError(400, `${label} không hợp lệ.`, 'invalid_field');
  }
  const text = value.trim();
  if ((required && !text) || text.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) {
    throw new HttpError(400, `${label} không hợp lệ.`, 'invalid_field');
  }
  return text;
}

function validEmail(value) {
  const email = cleanString(value, 'Email', 254).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Email không đúng định dạng.', 'invalid_email');
  return email;
}

function validPassword(value) {
  if (typeof value !== 'string' || value.length < 6 || value.length > 256) {
    throw new HttpError(400, 'Mật khẩu cần có ít nhất 6 ký tự.', 'invalid_password');
  }
  return value;
}

function validPoster(value) {
  const raw = cleanString(value, 'Poster', 600);
  let url;
  try { url = new URL(raw); } catch { throw new HttpError(400, 'URL poster không hợp lệ.', 'invalid_url'); }
  if (url.protocol !== 'https:') throw new HttpError(400, 'Poster phải dùng HTTPS.', 'invalid_url');
  return url.toString();
}

function validMovie(body, partial = false) {
  const output = {};
  const fields = [
    ['title', 'Tên phim', 180], ['genre', 'Thể loại', 180], ['duration', 'Thời lượng', 40],
    ['release_text', 'Ngày phát hành', 40], ['director', 'Đạo diễn', 180], ['actors', 'Diễn viên', 500],
    ['description', 'Mô tả', 3000],
  ];
  for (const [key, label, max] of fields) {
    if (partial && body[key] === undefined) continue;
    output[key] = cleanString(body[key] ?? '', label, max, key === 'title' || key === 'description');
  }
  if (!partial || body.rating !== undefined) {
    const rating = cleanString(body.rating || 'P', 'Nhãn tuổi', 8);
    if (!['T13','T16','T18','P','K'].includes(rating)) throw new HttpError(400, 'Nhãn tuổi không hợp lệ.');
    output.rating = rating;
  }
  if (!partial || body.status !== undefined) {
    const status = body.status || 'now_showing';
    if (!['now_showing','coming_soon'].includes(status)) throw new HttpError(400, 'Trạng thái phim không hợp lệ.');
    output.status = status;
  }
  if (!partial || body.poster_url !== undefined || body.poster !== undefined) output.poster_url = validPoster(body.poster_url || body.poster);
  return output;
}

async function requireUser(pool, request) {
  const user = await getCurrentUser(pool, request);
  if (!user) throw new HttpError(401, 'Vui lòng đăng nhập để tiếp tục.', 'authentication_required');
  return user;
}

async function requireAdmin(pool, request) {
  const user = await requireUser(pool, request);
  if (user.role !== 'admin') throw new HttpError(403, 'Bạn không có quyền quản trị.', 'admin_required');
  return user;
}

async function publicCatalog(pool) {
  const today = dateInVietnam(0);
  const timeNow = timeInVietnam();
  const [movies] = await pool.query("SELECT code,title,genre,duration,rating,release_text AS releaseText,director,actors AS actor,description AS `desc`,poster_url AS poster,status FROM movies ORDER BY status='now_showing' DESC,title");
  const [cinemas] = await pool.query("SELECT id,name,address,city,IF(status='active','Hoạt động','Không hoạt động') AS status FROM cinemas WHERE status='active' ORDER BY name");
  const [rooms] = await pool.query("SELECT r.id,r.name,r.seat_count AS seats,c.name AS cinema,IF(r.status='active','Đang sử dụng','Phòng trống') AS status FROM rooms r JOIN cinemas c ON c.id=r.cinema_id ORDER BY c.name,r.name");
  const [concessions] = await pool.query('SELECT item_key AS `key`,name,description,category,unit_price AS price,options_json AS options,image_url AS image FROM concessions WHERE active=TRUE ORDER BY category,item_key');
  const [showtimes] = await pool.execute(
    `SELECT s.id,s.movie_code AS movieCode,m.title AS movie,s.cinema_id AS cinemaId,c.name AS cinema,c.address,
            s.room_id AS roomId,r.name AS room,DATE_FORMAT(s.show_date,'%Y-%m-%d') AS date,
            TIME_FORMAT(s.start_time,'%H:%i') AS time,s.format,s.base_price AS basePrice,s.status
       FROM showtimes s JOIN movies m ON m.code=s.movie_code JOIN cinemas c ON c.id=s.cinema_id JOIN rooms r ON r.id=s.room_id
      WHERE (s.show_date>? OR (s.show_date=? AND TIME_FORMAT(s.start_time,'%H:%i')>?))
        AND s.status='on_sale' AND m.status='now_showing' AND c.status='active' AND r.status='active'
      ORDER BY s.show_date,s.start_time,c.name`, [today,today,timeNow]);
  return { movies, cinemas, rooms, concessions: concessions.map((item) => ({ ...item, options: typeof item.options === 'string' ? JSON.parse(item.options) : item.options })), showtimes };
}

async function seatMap(pool, showtimeId) {
  if (!/^\d+$/.test(String(showtimeId))) throw new HttpError(400, 'Suất chiếu không hợp lệ.');
  const [rows] = await pool.execute("SELECT id,DATE_FORMAT(show_date,'%Y-%m-%d') AS date,TIME_FORMAT(start_time,'%H:%i') AS time,base_price AS basePrice,status FROM showtimes WHERE id=?", [showtimeId]);
  if (!rows.length) throw new HttpError(404, 'Không tìm thấy suất chiếu.');
  const [seats] = await pool.execute('SELECT seat_code AS code FROM booking_seats WHERE showtime_id=? ORDER BY seat_code', [showtimeId]);
  return { showtime: rows[0], soldSeats: seats.map((seat) => seat.code) };
}

async function profileData(pool, userId) {
  const [bookings] = await pool.execute(
    `SELECT b.code,b.customer_name AS customer,b.customer_email AS customerEmail,b.user_id AS userId,
            m.title AS movie,m.poster_url AS poster,c.name AS cinema,r.name AS room,
            DATE_FORMAT(s.show_date,'%Y-%m-%d') AS date,TIME_FORMAT(s.start_time,'%H:%i') AS time,
            b.ticket_count AS seatCount,b.total_amount AS total,b.pay_method AS payMethod,
            COALESCE(bs.seats,'') AS seats,COALESCE(bi.comboText,'Không kèm bắp nước') AS comboText,
            b.created_at AS createdAt
       FROM bookings b JOIN showtimes s ON s.id=b.showtime_id JOIN movies m ON m.code=s.movie_code
       JOIN cinemas c ON c.id=s.cinema_id JOIN rooms r ON r.id=s.room_id
       LEFT JOIN (SELECT booking_id,GROUP_CONCAT(DISTINCT seat_code ORDER BY seat_code SEPARATOR ', ') AS seats
                    FROM booking_seats GROUP BY booking_id) bs ON bs.booking_id=b.id
       LEFT JOIN (SELECT booking_id,GROUP_CONCAT(DISTINCT CONCAT(quantity,'x ',item_name,IF(choice='', '', CONCAT(' (',choice,')'))) SEPARATOR ' + ') AS comboText
                    FROM booking_items GROUP BY booking_id) bi ON bi.booking_id=b.id
      WHERE b.user_id=? ORDER BY b.created_at DESC`, [userId]);
  return { bookings };
}

async function adminDashboard(pool) {
  const today = dateInVietnam(0);
  const timeNow = timeInVietnam();
  const [[totals]] = await pool.query("SELECT COALESCE(SUM(total_amount),0) AS totalRevenue,COALESCE(SUM(ticket_count),0) AS totalTickets,COUNT(*) AS totalOrders FROM bookings WHERE status='demo_confirmed'");
  const [[members]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role='customer' AND status='active'");
  const [movieRows] = await pool.query("SELECT m.code,m.title,m.genre,m.duration,m.rating,m.release_text AS releaseText,m.director,m.actors AS actor,m.description AS `desc`,m.poster_url AS poster,m.status,COALESCE(SUM(b.ticket_count),0) AS tickets,COALESCE(SUM(b.total_amount),0) AS revenue FROM movies m LEFT JOIN showtimes s ON s.movie_code=m.code LEFT JOIN bookings b ON b.showtime_id=s.id AND b.status='demo_confirmed' GROUP BY m.code ORDER BY m.title");
  const [cinemas] = await pool.query("SELECT id,name,address,city,IF(status='active','Hoạt động','Không hoạt động') AS status,status AS rawStatus FROM cinemas ORDER BY name");
  const [rooms] = await pool.query("SELECT r.id,r.name,r.cinema_id AS cinemaId,c.name AS cinema,r.seat_count AS seats,IF(r.status='active','Đang sử dụng','Phòng trống') AS status,r.status AS rawStatus FROM rooms r JOIN cinemas c ON c.id=r.cinema_id ORDER BY c.name,r.name");
  const [showtimes] = await pool.query(
    `SELECT s.id,s.movie_code AS movieCode,m.title AS movie,s.cinema_id AS cinemaId,c.name AS cinema,
            s.room_id AS roomId,r.name AS room,DATE_FORMAT(s.show_date,'%Y-%m-%d') AS date,
            TIME_FORMAT(s.start_time,'%H:%i') AS time,s.format,s.base_price AS basePrice,s.status,
            r.seat_count AS capacity,COALESCE(seat_counts.soldCount,0) AS soldCount
       FROM showtimes s JOIN movies m ON m.code=s.movie_code JOIN cinemas c ON c.id=s.cinema_id
       JOIN rooms r ON r.id=s.room_id
       LEFT JOIN (SELECT showtime_id,COUNT(*) AS soldCount FROM booking_seats GROUP BY showtime_id) seat_counts
         ON seat_counts.showtime_id=s.id
      WHERE s.status='on_sale' AND (s.show_date>? OR (s.show_date=? AND TIME_FORMAT(s.start_time,'%H:%i')>=?))
      ORDER BY s.show_date,s.start_time`, [today,today,timeNow]);
  const [users] = await pool.query("SELECT public_id AS id,name,email,phone,role,status,created_at AS createdAt FROM users WHERE role='customer' ORDER BY created_at DESC");
  const [staffRows] = await pool.query("SELECT id,name,email,phone,role_label AS role,status,'directory' AS source FROM staff_directory ORDER BY name");
  const [actualAdmins] = await pool.query("SELECT public_id AS id,name,email,phone,'admin' AS role,status,'user' AS source FROM users WHERE role='admin' ORDER BY created_at");
  const staffByEmail = new Map(staffRows.map((row) => [row.email.toLowerCase(), row]));
  for (const admin of actualAdmins) staffByEmail.set(admin.email.toLowerCase(), admin);
  const [bookings] = await pool.query(
    `SELECT b.id,b.code,b.customer_name AS customer,b.customer_email AS customerEmail,m.title AS movie,m.poster_url AS poster,
            c.name AS cinema,r.name AS room,DATE_FORMAT(s.show_date,'%Y-%m-%d') AS date,TIME_FORMAT(s.start_time,'%H:%i') AS time,
            b.ticket_count AS seatCount,b.total_amount AS total,b.pay_method AS payMethod,b.status,
            COALESCE(bs.seats,'') AS seats,COALESCE(bi.comboText,'Không kèm bắp nước') AS comboText,
            b.created_at AS createdAt
       FROM bookings b JOIN showtimes s ON s.id=b.showtime_id JOIN movies m ON m.code=s.movie_code JOIN cinemas c ON c.id=s.cinema_id JOIN rooms r ON r.id=s.room_id
       LEFT JOIN (SELECT booking_id,GROUP_CONCAT(DISTINCT seat_code ORDER BY seat_code SEPARATOR ', ') AS seats
                    FROM booking_seats GROUP BY booking_id) bs ON bs.booking_id=b.id
       LEFT JOIN (SELECT booking_id,GROUP_CONCAT(DISTINCT CONCAT(quantity,'x ',item_name,IF(choice='', '', CONCAT(' (',choice,')'))) SEPARATOR ' + ') AS comboText
                    FROM booking_items GROUP BY booking_id) bi ON bi.booking_id=b.id
      ORDER BY b.created_at DESC LIMIT 300`);
  const movieTickets = {};
  const movieRevenue = {};
  for (const movie of movieRows) {
    movieTickets[movie.title] = Number(movie.tickets);
    movieRevenue[movie.title] = Number(movie.revenue);
  }
  const soldSeatsByShowtime = {};
  for (const showtime of showtimes) soldSeatsByShowtime[String(showtime.id)] = Number(showtime.soldCount);
  const totalCapacity = showtimes.reduce((sum, showtime) => sum + Number(showtime.capacity), 0);
  const totalSoldSeats = showtimes.reduce((sum, showtime) => sum + Number(showtime.soldCount), 0);
  const [dailyRevenueRows] = await pool.execute(
    "SELECT DATE_FORMAT(DATE(CONVERT_TZ(created_at,'+00:00','+07:00')),'%Y-%m-%d') AS date,COALESCE(SUM(total_amount),0) AS revenue FROM bookings WHERE status='demo_confirmed' AND DATE(CONVERT_TZ(created_at,'+00:00','+07:00'))>=DATE_SUB(?, INTERVAL 6 DAY) GROUP BY DATE_FORMAT(DATE(CONVERT_TZ(created_at,'+00:00','+07:00')),'%Y-%m-%d') ORDER BY DATE_FORMAT(DATE(CONVERT_TZ(created_at,'+00:00','+07:00')),'%Y-%m-%d')", [today]);
  const revenueByDay = Object.fromEntries(dailyRevenueRows.map((row) => [row.date, Number(row.revenue)]));
  return {
    stats: {
      totalRevenue: Number(totals.totalRevenue), totalTickets: Number(totals.totalTickets),
      totalOrders: Number(totals.totalOrders), newMembers: Number(members.count), movieTickets, movieRevenue,
      soldSeatsByShowtime, totalCapacity, totalSoldSeats, revenueByDay,
    },
    movies: movieRows.map(({ tickets, revenue, ...movie }) => movie),
    cinemas, rooms, showtimes, users, staff: [...staffByEmail.values()], bookings,
  };
}

async function createBooking(pool, body, user) {
  const showtimeId = Number(body.showtimeId);
  if (!Number.isSafeInteger(showtimeId) || showtimeId < 1) throw new HttpError(400, 'Vui lòng chọn suất chiếu.', 'invalid_showtime');
  const seats = Array.isArray(body.seats) ? body.seats : [];
  if (!seats.length || seats.length > 8 || new Set(seats).size !== seats.length || seats.some((seat) => typeof seat !== 'string' || !/^(?:[A-F](?:0[1-9]|1[0-2])|G0[1-6])$/.test(seat))) {
    throw new HttpError(400, 'Danh sách ghế không hợp lệ.', 'invalid_seats');
  }
  const customer = body.customer || {};
  const customerName = cleanString(customer.name, 'Họ tên', 120);
  const customerEmail = validEmail(customer.email);
  const customerPhone = cleanString(customer.phone, 'Số điện thoại', 32);
  const payMethod = cleanString(body.payMethod, 'Phương thức thanh toán', 40);
  if (!PAY_METHODS.has(payMethod)) throw new HttpError(400, 'Phương thức thanh toán không hợp lệ.');
  if (body.termsAccepted !== true) throw new HttpError(400, 'Vui lòng đồng ý điều khoản và xác nhận độ tuổi.', 'terms_required');
  const itemsInput = Array.isArray(body.items) ? body.items : [];
  if (itemsInput.length > 4) throw new HttpError(400, 'Danh mục bắp nước không hợp lệ.');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [showRows] = await conn.execute(
      `SELECT s.id,s.movie_code AS movieCode,m.title AS movie,m.poster_url AS poster,c.name AS cinema,r.name AS room,
              s.cinema_id AS cinemaId,s.room_id AS roomId,DATE_FORMAT(s.show_date,'%Y-%m-%d') AS date,
              TIME_FORMAT(s.start_time,'%H:%i') AS time,s.base_price AS basePrice,s.status
         FROM showtimes s JOIN movies m ON m.code=s.movie_code JOIN cinemas c ON c.id=s.cinema_id JOIN rooms r ON r.id=s.room_id
        WHERE s.id=? FOR UPDATE`, [showtimeId]);
    if (!showRows.length || showRows[0].status !== 'on_sale') throw new HttpError(409, 'Suất chiếu không còn mở bán.', 'showtime_closed');
    const show = showRows[0];
    const today = dateInVietnam(0);
    const timeNow = timeInVietnam();
    if (show.date < today || (show.date === today && show.time < timeNow)) throw new HttpError(409, 'Suất chiếu đã qua.', 'showtime_expired');
    const seatPlaceholders = seats.map(() => '?').join(',');
    const [taken] = await conn.execute(`SELECT seat_code FROM booking_seats WHERE showtime_id=? AND seat_code IN (${seatPlaceholders})`, [showtimeId,...seats]);
    if (taken.length) throw new HttpError(409, `Ghế ${taken.map((row) => row.seat_code).join(', ')} vừa được người khác đặt. Vui lòng chọn lại.`, 'seat_unavailable');

    const basePrice = Number(show.basePrice);
    const pricedSeats = seats.map((code) => {
      const row = code[0];
      if (row === 'G') return { code, type: 'Ghế đôi', price: basePrice * 2 };
      if (['D','E','F'].includes(row)) return { code, type: 'Ghế VIP', price: basePrice + 20000 };
      return { code, type: 'Ghế thường', price: basePrice };
    });
    const [concessionRows] = await conn.query('SELECT item_key,name,unit_price,options_json FROM concessions WHERE active=TRUE');
    const concessionMap = new Map(concessionRows.map((row) => [row.item_key, row]));
    const normalizedItems = [];
    for (const item of itemsInput) {
      const entry = concessionMap.get(String(item.key));
      const quantity = Number(item.quantity);
      if (!entry || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new HttpError(400, 'Món bắp nước hoặc số lượng không hợp lệ.');
      const options = typeof entry.options_json === 'string' ? JSON.parse(entry.options_json) : entry.options_json;
      const choice = item.choice ? cleanString(item.choice, 'Lựa chọn món', 80) : '';
      if (choice && !options.includes(choice)) throw new HttpError(400, 'Tùy chọn món không hợp lệ.');
      normalizedItems.push({ key: entry.item_key, name: entry.name, price: Number(entry.unit_price), quantity, choice });
    }
    const ticketTotal = pricedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const foodTotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = ticketTotal + foodTotal;
    const code = `CTX-${show.date.replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const [insert] = await conn.execute(
      "INSERT INTO bookings (code,user_id,showtime_id,customer_name,customer_email,customer_phone,pay_method,status,ticket_count,total_amount) VALUES (?,?,?,?,?,?,?,'demo_confirmed',?,?)",
      [code,user?.id || null,showtimeId,customerName,customerEmail,customerPhone,payMethod,pricedSeats.length,total]);
    for (const seat of pricedSeats) {
      await conn.execute('INSERT INTO booking_seats (booking_id,showtime_id,seat_code,seat_type,unit_price) VALUES (?,?,?,?,?)', [insert.insertId,showtimeId,seat.code,seat.type,seat.price]);
    }
    for (const item of normalizedItems) {
      await conn.execute('INSERT INTO booking_items (booking_id,item_key,item_name,quantity,choice,unit_price,line_total) VALUES (?,?,?,?,?,?,?)', [insert.insertId,item.key,item.name,item.quantity,item.choice,item.price,item.price*item.quantity]);
    }
    await conn.commit();
    return {
      code, customer: customerName, customerEmail, userId: user ? String(user.public_id) : null,
      movie: show.movie, poster: show.poster, cinema: show.cinema, room: show.room, date: show.date, time: show.time,
      seats: pricedSeats.map((seat) => seat.code).join(', '), seatCount: pricedSeats.length,
      comboText: normalizedItems.length ? normalizedItems.map((item) => `${item.quantity}x ${item.name}${item.choice ? ` (${item.choice})` : ''}`).join(' + ') : 'Không kèm bắp nước',
      payMethod, total, status: 'demo_confirmed',
    };
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Ghế vừa được người khác đặt. Vui lòng tải sơ đồ ghế và chọn lại.', 'seat_unavailable');
    throw error;
  } finally {
    conn.release();
  }
}

function insertId(prefix) { return `${prefix}${crypto.randomBytes(4).toString('hex').toUpperCase()}`; }

async function routeApi(pool, request, response, url) {
  ensureCsrfCookie(request, response);
  const method = request.method;
  const pathname = url.pathname;
  if (!['GET','HEAD'].includes(method) && !verifyCsrf(request)) throw new HttpError(403, 'Yêu cầu không vượt qua kiểm tra bảo mật.', 'csrf_failed');

  if (method === 'GET' && pathname === '/api/bootstrap') return sendJson(response, 200, await publicCatalog(pool));
  if (method === 'GET' && pathname === '/api/session') {
    const user = await getCurrentUser(pool, request);
    return sendJson(response, 200, { user: userView(user) });
  }
  if (method === 'POST' && pathname === '/api/auth/register') {
    const body = await readJson(request);
    await enforceSharedRateLimit(pool, 'register');
    const name = cleanString(body.name, 'Họ tên', 120);
    const email = validEmail(body.email);
    const phone = cleanString(body.phone, 'Số điện thoại', 32);
    const password = validPassword(body.password);
    try {
      const passwordHash = await hashPassword(password);
      const [insert] = await pool.execute("INSERT INTO users (public_id,name,email,phone,password_hash,role,status) VALUES (?,?,?,?,?,'customer','active')", [`U-${crypto.randomUUID().replaceAll('-', '').slice(0, 30)}`,name,email,phone,passwordHash]);
      await createSession(pool, response, insert.insertId);
      const [rows] = await pool.execute("SELECT id,public_id,name,email,phone,'' AS dob,role,status FROM users WHERE id=?", [insert.insertId]);
      return sendJson(response, 201, { user: userView(rows[0]) });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Email này đã được đăng ký! Vui lòng đăng nhập.', 'email_exists');
      throw error;
    }
  }
  if (method === 'POST' && pathname === '/api/auth/login') {
    const body = await readJson(request);
    await enforceSharedRateLimit(pool, 'login');
    const email = validEmail(body.email);
    if (typeof body.password !== 'string' || body.password.length > 256) throw new HttpError(401, 'Email hoặc Mật khẩu không chính xác.', 'login_failed');
    const [rows] = await pool.execute('SELECT * FROM users WHERE email=? AND status=\'active\' LIMIT 1', [email]);
    const row = rows[0];
    if (!row || !(await verifyPassword(body.password, row.password_hash))) throw new HttpError(401, 'Email hoặc Mật khẩu không chính xác.', 'login_failed');
    await createSession(pool, response, row.id);
    return sendJson(response, 200, { user: userView(row) });
  }
  if (method === 'POST' && pathname === '/api/auth/logout') {
    await destroySession(pool, request, response);
    return sendJson(response, 200, { ok: true });
  }
  if (method === 'GET' && pathname === '/api/profile') {
    const user = await requireUser(pool, request);
    return sendJson(response, 200, await profileData(pool, user.id));
  }
  if (method === 'PUT' && pathname === '/api/profile') {
    const user = await requireUser(pool, request);
    const body = await readJson(request);
    const name = cleanString(body.name, 'Họ tên', 120);
    const email = validEmail(body.email);
    const phone = cleanString(body.phone || '', 'Số điện thoại', 32, false);
    const dob = body.dob ? cleanString(body.dob, 'Ngày sinh', 10) : null;
    if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) throw new HttpError(400, 'Ngày sinh không hợp lệ.');
    try {
      await pool.execute('UPDATE users SET name=?,email=?,phone=?,dob=? WHERE id=?', [name,email,phone,dob,user.id]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Email này đã được đăng ký.', 'email_exists');
      throw error;
    }
    const [rows] = await pool.execute("SELECT id,public_id,name,email,phone,DATE_FORMAT(dob,'%Y-%m-%d') AS dob,role,status FROM users WHERE id=?", [user.id]);
    return sendJson(response, 200, { user: userView(rows[0]) });
  }
  if (method === 'POST' && pathname === '/api/bookings') {
    const body = await readJson(request);
    await enforceSharedRateLimit(pool, 'booking');
    const user = await getCurrentUser(pool, request);
    const booking = await createBooking(pool, body, user);
    return sendJson(response, 201, { booking });
  }
  const seatMatch = pathname.match(/^\/api\/showtimes\/(\d+)\/seats$/);
  if (method === 'GET' && seatMatch) return sendJson(response, 200, await seatMap(pool, seatMatch[1]));

  if (pathname.startsWith('/api/admin/')) await requireAdmin(pool, request);
  if (method === 'GET' && pathname === '/api/admin/dashboard') return sendJson(response, 200, await adminDashboard(pool));

  if (pathname === '/api/admin/movies' && method === 'POST') {
    const body = await readJson(request);
    const movie = validMovie(body);
    const [rows] = await pool.query("SELECT MAX(CAST(SUBSTRING(code,4) AS UNSIGNED)) AS maxCode FROM movies WHERE code REGEXP '^PH-[0-9]+$'");
    const code = `PH-${String(Number(rows[0].maxCode || 0) + 1).padStart(3,'0')}`;
    await pool.execute('INSERT INTO movies (code,title,genre,duration,rating,release_text,director,actors,description,poster_url,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [code,movie.title,movie.genre,movie.duration,movie.rating,movie.release_text,movie.director,movie.actors,movie.description,movie.poster_url,movie.status]);
    return sendJson(response, 201, { code });
  }
  const movieMatch = pathname.match(/^\/api\/admin\/movies\/([A-Za-z0-9_-]+)$/);
  if (movieMatch && method === 'PUT') {
    const body = await readJson(request);
    const movie = validMovie(body);
    const [result] = await pool.execute('UPDATE movies SET title=?,genre=?,duration=?,rating=?,release_text=?,director=?,actors=?,description=?,poster_url=?,status=? WHERE code=?', [movie.title,movie.genre,movie.duration,movie.rating,movie.release_text,movie.director,movie.actors,movie.description,movie.poster_url,movie.status,movieMatch[1]]);
    if (!result.affectedRows) throw new HttpError(404, 'Không tìm thấy phim.');
    return sendJson(response, 200, { ok: true });
  }
  if (movieMatch && method === 'DELETE') {
    const [refs] = await pool.execute('SELECT COUNT(*) AS count FROM showtimes WHERE movie_code=?', [movieMatch[1]]);
    if (Number(refs[0].count)) throw new HttpError(409, 'Phim đã có suất chiếu; hãy đóng suất chiếu trước khi xóa.', 'movie_in_use');
    const [result] = await pool.execute('DELETE FROM movies WHERE code=?', [movieMatch[1]]);
    if (!result.affectedRows) throw new HttpError(404, 'Không tìm thấy phim.');
    return sendJson(response, 200, { ok: true });
  }

  if (pathname === '/api/admin/cinemas' && method === 'POST') {
    const body = await readJson(request);
    const name = cleanString(body.name, 'Tên rạp', 180);
    const address = cleanString(body.address || '', 'Địa chỉ', 255, false);
    const city = cleanString(body.city, 'Tỉnh/thành phố', 120);
    const id = insertId('CN-');
    try { await pool.execute("INSERT INTO cinemas (id,name,address,city,status) VALUES (?,?,?,?, 'active')", [id,name,address,city]); }
    catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Tên rạp đã tồn tại.'); throw error; }
    return sendJson(response, 201, { id });
  }
  const cinemaMatch = pathname.match(/^\/api\/admin\/cinemas\/([A-Za-z0-9_-]+)$/);
  if (cinemaMatch && method === 'DELETE') {
    try { const [result] = await pool.execute('DELETE FROM cinemas WHERE id=?', [cinemaMatch[1]]); if (!result.affectedRows) throw new HttpError(404, 'Không tìm thấy rạp.'); }
    catch (error) { if (error.code === 'ER_ROW_IS_REFERENCED_2') throw new HttpError(409, 'Rạp còn phòng hoặc suất chiếu; không thể xóa lịch sử.'); throw error; }
    return sendJson(response, 200, { ok: true });
  }

  if (pathname === '/api/admin/rooms' && method === 'POST') {
    const body = await readJson(request);
    const cinemaId = cleanString(body.cinemaId, 'Rạp', 32);
    const name = cleanString(body.name, 'Tên phòng', 100);
    const seats = Number(body.seats || 78);
    if (!Number.isInteger(seats) || seats !== 78) throw new HttpError(400, 'Sơ đồ ghế demo hiện hỗ trợ đúng 78 ghế mỗi phòng.');
    const id = insertId('R-');
    try { await pool.execute("INSERT INTO rooms (id,cinema_id,name,seat_count,status) VALUES (?,?,?,?, 'active')", [id,cinemaId,name,seats]); }
    catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Tên phòng đã có tại rạp này.'); if (error.code === 'ER_NO_REFERENCED_ROW_2') throw new HttpError(404, 'Không tìm thấy rạp.'); throw error; }
    return sendJson(response, 201, { id });
  }
  const roomMatch = pathname.match(/^\/api\/admin\/rooms\/([A-Za-z0-9_-]+)$/);
  if (roomMatch && method === 'DELETE') {
    try { const [result] = await pool.execute('DELETE FROM rooms WHERE id=?', [roomMatch[1]]); if (!result.affectedRows) throw new HttpError(404, 'Không tìm thấy phòng.'); }
    catch (error) { if (error.code === 'ER_ROW_IS_REFERENCED_2') throw new HttpError(409, 'Phòng còn suất chiếu/vé lịch sử; không thể xóa.'); throw error; }
    return sendJson(response, 200, { ok: true });
  }

  if (pathname === '/api/admin/users' && method === 'POST') {
    const body = await readJson(request);
    const name = cleanString(body.name, 'Họ tên', 120);
    const email = validEmail(body.email);
    const phone = cleanString(body.phone || '', 'Số điện thoại', 32, false);
    const password = validPassword(body.password);
    try {
      const [result] = await pool.execute("INSERT INTO users (public_id,name,email,phone,password_hash,role,status) VALUES (?,?,?,?,?,'customer','active')", [`U-${crypto.randomUUID().replaceAll('-', '').slice(0, 30)}`,name,email,phone,hashPassword(password)]);
      return sendJson(response, 201, { id: result.insertId });
    } catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Email này đã được đăng ký.'); throw error; }
  }
  const userMatch = pathname.match(/^\/api\/admin\/users\/([A-Za-z0-9_-]+)$/);
  if (userMatch && method === 'DELETE') {
    const [result] = await pool.execute("DELETE FROM users WHERE public_id=? AND role='customer'", [userMatch[1]]);
    if (!result.affectedRows) throw new HttpError(404, 'Không tìm thấy tài khoản khách hàng.');
    return sendJson(response, 200, { ok: true });
  }

  if (pathname === '/api/admin/staff' && method === 'POST') {
    const body = await readJson(request);
    const name = cleanString(body.name, 'Họ tên', 120);
    const email = validEmail(body.email);
    const phone = cleanString(body.phone || '', 'Số điện thoại', 32, false);
    const role = body.role === 'admin' ? 'admin' : 'employee';
    const id = insertId(role === 'admin' ? 'A-' : 'E-');
    try { await pool.execute('INSERT INTO staff_directory (id,name,email,phone,role_label,status) VALUES (?,?,?,?,?,\'active\')', [id,name,email,phone,role]); }
    catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Email nhân sự đã tồn tại.'); throw error; }
    return sendJson(response, 201, { id, roleNote: 'Danh bạ nhân sự không cấp quyền đăng nhập; quyền API admin chỉ thuộc tài khoản admin trong bảng users.' });
  }
  const staffMatch = pathname.match(/^\/api\/admin\/staff\/([A-Za-z0-9_-]+)$/);
  if (staffMatch && method === 'DELETE') {
    const [result] = await pool.execute('DELETE FROM staff_directory WHERE id=?', [staffMatch[1]]);
    if (!result.affectedRows) throw new HttpError(404, 'Không tìm thấy nhân sự.');
    return sendJson(response, 200, { ok: true });
  }

  const showtimeMatch = pathname.match(/^\/api\/admin\/showtimes\/(\d+)$/);
  if (showtimeMatch && method === 'PUT') {
    const body = await readJson(request);
    const date = cleanString(body.date, 'Ngày chiếu', 10);
    const time = cleanString(body.time, 'Giờ chiếu', 5);
    const price = Number(body.basePrice);
    const status = body.status || 'on_sale';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !Number.isInteger(price) || price < 1000 || price > 1000000 || !['on_sale','closed'].includes(status)) throw new HttpError(400, 'Thông tin suất chiếu không hợp lệ.');
    const [refs] = await pool.execute('SELECT COUNT(*) AS count FROM bookings WHERE showtime_id=?', [showtimeMatch[1]]);
    const [current] = await pool.execute('SELECT show_date,start_time FROM showtimes WHERE id=?', [showtimeMatch[1]]);
    if (!current.length) throw new HttpError(404, 'Không tìm thấy suất chiếu.');
    if (Number(refs[0].count) && (String(current[0].show_date) !== date || String(current[0].start_time).slice(0,5) !== time)) throw new HttpError(409, 'Suất chiếu đã có vé demo; chỉ được cập nhật giá/trạng thái để giữ nguyên lịch sử.');
    try { await pool.execute('UPDATE showtimes SET show_date=?,start_time=?,base_price=?,status=? WHERE id=?', [date,time,price,status,showtimeMatch[1]]); }
    catch (error) { if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Phòng đã có suất chiếu trùng giờ.'); throw error; }
    return sendJson(response, 200, { ok: true });
  }

  throw new HttpError(404, 'Không tìm thấy API.', 'not_found');
}

function createApiHandler(pool) {
  return async function apiHandler(request, response, url) {
    try {
      await routeApi(pool, request, response, url);
    } catch (error) {
      if (response.headersSent) { response.destroy(); return; }
      if (error instanceof HttpError) return sendJson(response, error.status, { error: error.message, code: error.code });
      console.error(`Cinetix API error (${request.method} ${url.pathname}): ${error.message}`);
      return sendJson(response, 500, { error: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.', code: 'internal_error' });
    }
  };
}

module.exports = { createApiHandler };
