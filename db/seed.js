'use strict';

const MOVIES = [
  { code: 'PH-001', title: 'Dưới bầu trời sao', genre: 'Khoa học viễn tưởng, Phiêu lưu', duration: '128 phút', rating: 'T13', release: '23/10/2026', director: 'Nguyễn Minh Khôi', actors: 'Trần Ngọc An, Lê Hoàng, Phạm Hà', description: 'Năm 2086, Trái Đất dần mất đi ánh sáng. Phi hành gia An cùng một đội thám hiểm đi theo tín hiệu bí ẩn từ thiên hà xa xôi để tìm lại hy vọng cho Trái Đất.', poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80' },
  { code: 'PH-002', title: 'Thành phố không ngủ', genre: 'Tình cảm, Đô thị', duration: '112 phút', rating: 'T16', release: '16/10/2026', director: 'Lê Thanh Sơn', actors: 'Tuấn Trần, Phương Anh Đào', description: 'Những cuộc gặp gỡ tình cờ giữa lòng Sài Gòn về đêm của hai tâm hồn cô đơn.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
  { code: 'PH-003', title: 'Sau cánh rừng', genre: 'Bí ẩn, Giật gân', duration: '105 phút', rating: 'T18', release: '23/10/2026', director: 'Trần Hữu Tấn', actors: 'Hoàng Hà, Quốc Trường', description: 'Bí mật bị chôn vùi hàng thập kỷ trong khu rừng sương mù dần hé lộ.', poster: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { code: 'PH-004', title: 'Mùa hè rực rỡ', genre: 'Thanh xuân, Gia đình', duration: '118 phút', rating: 'K', release: '09/10/2026', director: 'Vũ Ngọc Đãng', actors: 'Kaity Nguyễn, Anh Tú', description: 'Chuyến đi biển cuối cùng của nhóm bạn thân trước ngưỡng cửa trưởng thành.', poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { code: 'PH-005', title: 'LILO & STITCH', genre: 'Gia đình, Hài, Phiêu Lưu', duration: '107 phút', rating: 'P', release: '23/05/2025', director: 'Dean Fleischer Camp', actors: 'Maia Kealoha, Sydney Elizabeth Agudong, Tia Carrere', description: 'Phiên bản live action kể lại câu chuyện cảm động giữa cô bé Lilo và sinh vật ngoài hành tinh Stitch.', poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80' },
  { code: 'PH-006', title: 'TỪ VŨ TRỤ JOHN WICK: BALLERINA', genre: 'Hành Động, Hồi hộp', duration: '125 phút', rating: 'T18', release: '06/06/2025', director: 'Len Wiseman', actors: 'Ana de Armas, Keanu Reeves, Ian McShane', description: 'Nữ sát thủ trẻ tuổi tìm kiếm sự trả thù cho gia đình mình trong thế giới ngầm John Wick.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80' },
  { code: 'PH-007', title: 'BỘ 5 SIÊU ĐẲNG CẤP', genre: 'Hài, Hành Động, Thần thoại', duration: '119 phút', rating: 'T16', release: '13/07/2025', director: 'Kang Hyeong-cheol', actors: 'Lee Jae-in, Yoo Ah-in, Ra Mi-ran', description: 'Năm người bình thường bất ngờ nhận được siêu năng lực sau ca ghép tạng bí ẩn.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { code: 'PH-008', title: 'DƯỚI ĐÁY HỒ', genre: 'Kinh dị, Bí ẩn', duration: '102 phút', rating: 'T18', release: '15/08/2025', director: 'Trần Hữu Tấn', actors: 'Kay Trần, Thanh Duy, Karen Nguyễn', description: 'Truyền thuyết đô thị kỳ bí về hồ nước tử thần tại làng đại học.', poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80' },
];

const CINEMAS = [
  { id: 'LM81', name: 'Cinetix Landmark 81', address: '720A Điện Biên Phủ, Bình Thạnh', city: 'TP. Hồ Chí Minh' },
  { id: 'CMQ7', name: 'Cinetix Crescent Mall', address: '101 Tôn Dật Tiên, Quận 7', city: 'TP. Hồ Chí Minh' },
  { id: 'BT1', name: 'Cinetix Bến Tre 1', address: '109 Hùng Vương, Phường 3', city: 'Bến Tre' },
  { id: 'HN1', name: 'Cinetix Hà Nội 1', address: '100 Hồ Con Rùa, Quận Hoàn Kiếm', city: 'Hà Nội' },
  { id: 'TV1', name: 'Cinetix Trà Vinh 1', address: '106 Nguyễn Thị Minh Khai, Phường 1', city: 'Trà Vinh' },
];

const ROOMS = [
  { id: 'R-LM81-03', cinemaId: 'LM81', name: 'Phòng 03', seats: 78 },
  { id: 'R-CMQ7-02', cinemaId: 'CMQ7', name: 'Phòng 02', seats: 78 },
  { id: 'R-BT1-04', cinemaId: 'BT1', name: 'Phòng 04', seats: 78 },
  { id: 'R-HN1-01', cinemaId: 'HN1', name: 'Phòng 01', seats: 78 },
];

const STAFF = [
  { id: 'A111111', name: 'Daniel', email: 'daniel@example.com', phone: '0321654987', role: 'admin', status: 'active' },
  { id: 'A123456', name: 'Alice (Nguyễn Hoàng)', email: 'alice@example.com', phone: '0123456789', role: 'admin', status: 'active' },
  { id: 'A222222', name: 'Elisa', email: 'elisa@example.com', phone: '0399998888', role: 'admin', status: 'inactive' },
  { id: 'A321654', name: 'Bob', email: 'bob@example.com', phone: '0987654321', role: 'admin', status: 'active' },
  { id: 'E147852', name: 'Helen', email: 'helen@example.com', phone: '0901234567', role: 'employee', status: 'active' },
];

const CONCESSIONS = [
  { key: 'combo1', name: 'Combo Một mình vui', description: '1 bắp vừa + 1 nước ngọt 500 ml.', category: 'combo', price: 69000, options: ['Caramel', 'Phô mai', 'Bơ'], image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=600&q=80' },
  { key: 'popcornOnly', name: 'Bắp giòn yêu thích', description: '1 bắp rang nóng, tự chọn vị.', category: 'popcorn', price: 45000, options: ['Caramel', 'Phô mai', 'Bơ'], image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80' },
  { key: 'coca', name: 'Coca Cola / Fanta', description: 'Nước ngọt 500 ml.', category: 'drink', price: 40000, options: ['Coca Cola', 'Fanta'], image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80' },
  { key: 'milo', name: 'Milo / Sprite / Trà đào', description: 'Nước uống lựa chọn.', category: 'drink', price: 25000, options: ['Milo', 'Sprite', 'Trà đào'], image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80' },
];

function dateInVietnam(offsetDays) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const current = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const base = new Date(Date.UTC(Number(current.year), Number(current.month) - 1, Number(current.day) + offsetDays));
  return base.toISOString().slice(0, 10);
}

function timeInVietnam() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date());
}

async function insertIfEmpty(connection, table, sql, rows) {
  const [[{ count }]] = await connection.query(`SELECT COUNT(*) AS count FROM ${table}`);
  if (Number(count) !== 0) return;
  for (const row of rows) await connection.execute(sql, row);
}

async function seedCatalog(connection) {
  await insertIfEmpty(connection, 'movies',
    'INSERT INTO movies (code,title,genre,duration,rating,release_text,director,actors,description,poster_url,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    MOVIES.map((m) => [m.code,m.title,m.genre,m.duration,m.rating,m.release,m.director,m.actors,m.description,m.poster,'now_showing']));

  await insertIfEmpty(connection, 'cinemas',
    'INSERT INTO cinemas (id,name,address,city,status) VALUES (?,?,?,?,\'active\')',
    CINEMAS.map((c) => [c.id,c.name,c.address,c.city]));

  await insertIfEmpty(connection, 'rooms',
    'INSERT INTO rooms (id,cinema_id,name,seat_count,status) VALUES (?,?,?,?,\'active\')',
    ROOMS.map((r) => [r.id,r.cinemaId,r.name,r.seats]));

  await insertIfEmpty(connection, 'concessions',
    'INSERT INTO concessions (item_key,name,description,category,unit_price,options_json,image_url,active) VALUES (?,?,?,?,?,?,?,TRUE)',
    CONCESSIONS.map((c) => [c.key,c.name,c.description,c.category,c.price,JSON.stringify(c.options),c.image]));

  await insertIfEmpty(connection, 'staff_directory',
    'INSERT INTO staff_directory (id,name,email,phone,role_label,status) VALUES (?,?,?,?,?,?)',
    STAFF.map((s) => [s.id,s.name,s.email,s.phone,s.role,s.status]));

  const slots = [
    { cinema: 'LM81', room: 'R-LM81-03', time: '14:00:00' },
    { cinema: 'LM81', room: 'R-LM81-03', time: '16:45:00' },
    { cinema: 'LM81', room: 'R-LM81-03', time: '19:30:00' },
    { cinema: 'LM81', room: 'R-LM81-03', time: '22:00:00' },
    { cinema: 'CMQ7', room: 'R-CMQ7-02', time: '15:15:00' },
    { cinema: 'CMQ7', room: 'R-CMQ7-02', time: '18:00:00' },
    { cinema: 'CMQ7', room: 'R-CMQ7-02', time: '20:45:00' },
    { cinema: 'BT1', room: 'R-BT1-04', time: '21:00:00' },
    { cinema: 'HN1', room: 'R-HN1-01', time: '10:30:00' },
  ];
  const movieCodes = MOVIES.map((movie) => movie.code);
  for (let offset = 1; offset <= 7; offset += 1) {
    const date = dateInVietnam(offset);
    for (let i = 0; i < slots.length; i += 1) {
      const slot = slots[i];
      const movieCode = movieCodes[(i + offset - 1) % movieCodes.length];
      await connection.execute(
        'INSERT IGNORE INTO showtimes (movie_code,cinema_id,room_id,show_date,start_time,format,base_price,status) VALUES (?,?,?,?,?,\'2D phụ đề\',95000,\'on_sale\')',
        [movieCode,slot.cinema,slot.room,date,slot.time]);
    }
  }
}

module.exports = { seedCatalog, MOVIES, CINEMAS, ROOMS, STAFF, CONCESSIONS, dateInVietnam, timeInVietnam };
