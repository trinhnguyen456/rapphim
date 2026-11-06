'use strict';

(function () {
  const api = window.CinetixApi;
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const money = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
  function demoQrDataUri(value) {
    let seed = 2166136261;
    for (const char of String(value)) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
    const size = 29;
    const finder = (x, y, left, top) => {
      const dx = x - left; const dy = y - top;
      if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
      return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
    };
    const rects = [];
    for (let y = 1; y < size - 1; y += 1) for (let x = 1; x < size - 1; x += 1) {
      const fixed = finder(x, y, 1, 1) ?? finder(x, y, size - 8, 1) ?? finder(x, y, 1, size - 8);
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0;
      if (fixed === true || (fixed === null && (seed & 1) === 1)) rects.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#111827">${rects.join('')}</g></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
  const oldSwitchAdminView = window.switchAdminView;
  let catalog = { movies: [], cinemas: [], rooms: [], concessions: [], showtimes: [] };
  let cinemaFilter = '';
  let selectedShowtime = null;
  let soldSeats = new Set();
  let lastTicket = null;
  let adminDashboard = null;
  let profileBookings = [];
  let adminRefreshBusy = false;
  let bookingBusy = false;
  let selectedAdminShowtimeId = null;
  let currentAdminView = 'overview';

  function partsOfDate(iso) {
    const [year, month, day] = String(iso || '').split('-');
    return { year, month, day };
  }

  function dateInVietnam(offset = 0) {
    const values = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date()).map((item) => [item.type, item.value]));
    const date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) + offset));
    return date.toISOString().slice(0, 10);
  }

  function addDays(iso, count) {
    const { year, month, day } = partsOfDate(iso);
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + count)).toISOString().slice(0, 10);
  }

  function dateLabel(iso) {
    if (!iso) return 'Chưa chọn ngày';
    const date = new Date(`${iso}T12:00:00+07:00`);
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(date);
  }

  function shortDate(iso) {
    const { day, month } = partsOfDate(iso);
    return day && month ? `${day}/${month}` : '';
  }

  function movieFromApi(movie) {
    return { ...movie, release: movie.releaseText || movie.release || '', actor: movie.actor || movie.actors || '', desc: movie.desc || movie.description || '' };
  }

  function todayForTicket(booking) {
    if (!booking?.date) return false;
    const today = dateInVietnam(0);
    if (booking.date > today) return true;
    if (booking.date < today) return false;
    const now = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
    return String(booking.time || '') >= now;
  }

  function setValue(id, value) {
    const element = $(id);
    if (element) element.value = value ?? '';
  }

  function setText(id, value) {
    const element = $(id);
    if (element) element.textContent = value ?? '';
  }

  function currentMovie() {
    return moviesCatalog.find((movie) => movie.code === state.movieCode) || moviesCatalog.find((movie) => movie.title === state.movie) || moviesCatalog[0] || null;
  }

  function syncMovieDetail(movie) {
    if (!movie) return;
    state.movie = movie.title;
    state.movieCode = movie.code;
    document.querySelectorAll('.sumMovieTitle').forEach((element) => { element.textContent = movie.title; });
    document.querySelectorAll('.sumMoviePoster').forEach((element) => { element.src = movie.poster; element.alt = movie.title; });
    setText('detailAgeBadge', movie.rating || 'P');
    setText('detailMetaLine', `${movie.genre || 'Phim truyện'} • ${movie.duration || ''}`);
    setText('detailReleaseLine', `Khởi chiếu: ${movie.release || 'Đang cập nhật'}`);
    setText('detailDescText', movie.desc || 'Thông tin phim đang được cập nhật.');
    setText('detailDirector', movie.director || 'Đang cập nhật');
    setText('detailActor', movie.actor || 'Đang cập nhật');
  }

  function renderMovieCatalog() {
    const homeGrid = $('homeMovieGrid');
    if (!homeGrid) return;
    const showing = moviesCatalog.filter((movie) => movie.status !== 'coming_soon');
    homeGrid.innerHTML = showing.map((movie) => `
      <article class="movie-card">
        <button class="poster-wrap" type="button" style="border:0;padding:0;background:transparent;width:100%;text-align:left;cursor:pointer;" data-movie-code="${esc(movie.code)}" aria-label="Xem ${esc(movie.title)}">
          <span class="age-badge">${esc(movie.rating)}</span>
          <img loading="lazy" src="${esc(movie.poster)}" alt="Poster ${esc(movie.title)}">
        </button>
        <h3 style="font-size:.96rem;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(movie.title)}</h3>
        <p style="font-size:.78rem;color:var(--text-muted);margin-bottom:12px;">${esc(movie.genre)} • ${esc(movie.duration)}</p>
        <button class="btn-pink" style="width:100%;" data-movie-code="${esc(movie.code)}">Đặt vé</button>
      </article>`).join('') || '<div class="empty-state-box">Chưa có phim đang chiếu.</div>';
    renderAdminMovieLibrary();
    const quick = $('quickMovieSelect');
    if (quick) {
      quick.innerHTML = showing.map((movie) => `<option value="${esc(movie.code)}">${esc(movie.title)}</option>`).join('');
      if (state.movieCode) quick.value = state.movieCode;
    }
  }

  function renderAdminMovieLibrary() {
    const list = $('adminMovieLibList');
    if (!list) return;
    const selected = currentMovie()?.code;
    setText('adminMovieTotalLabel', `${moviesCatalog.length} phim`);
    list.innerHTML = moviesCatalog.map((movie) => `
      <div class="movie-lib-item ${movie.code === selected ? 'active' : ''}" data-edit-movie="${esc(movie.code)}" role="button" tabindex="0">
        <img loading="lazy" src="${esc(movie.poster)}" alt="">
        <div><strong style="font-size:.92rem;display:block;margin-bottom:2px;">${esc(movie.title)}</strong>
          <span style="font-size:.75rem;color:var(--text-gray);display:block;">${esc(movie.genre)} • ${esc(movie.duration)} • ${esc(movie.rating)}</span>
          <span style="font-size:.72rem;color:var(--text-muted);">Khởi chiếu ${esc(movie.release)} • ${movie.status === 'coming_soon' ? 'Sắp chiếu' : 'Đang chiếu'}</span></div>
        <button class="btn-dark btn-sm" data-delete-movie="${esc(movie.code)}" aria-label="Xóa ${esc(movie.title)}">Xóa</button>
      </div>`).join('');
  }

  function showMovie(code, openTrailer = false) {
    const movie = moviesCatalog.find((item) => item.code === code || item.title === code);
    if (!movie) return;
    syncMovieDetail(movie);
    state.selectedSeats = [];
    selectedShowtime = null;
    const options = catalog.showtimes.filter((item) => item.movieCode === movie.code && item.date === state.dateIso);
    cinemaFilter = '';
    selectedShowtime = options[0] || null;
    if (!selectedShowtime) { state.showtimeId = null; state.cinema = ''; state.room = ''; state.time = ''; }
    if (selectedShowtime) applyShowtime(selectedShowtime, false);
    renderSchedule();
    renderSeatMap();
    syncSummaryUI();
    const trailer = $('trailerBox');
    if (trailer) trailer.classList.toggle('hidden', !openTrailer);
  }

  function availableDates() {
    const values = [...new Set(catalog.showtimes.map((item) => item.date))].sort();
    return values.slice(0, 7);
  }

  function ensureDateSelection() {
    const dates = availableDates();
    if (!dates.length) return;
    if (!dates.includes(state.dateIso)) state.dateIso = dates[0];
    state.date = dateLabel(state.dateIso);
  }

  function renderDateStrip() {
    const strip = $('dateStrip');
    if (!strip) return;
    const dates = availableDates();
    if (!dates.length) {
      strip.innerHTML = '<div class="empty-state-box">Hiện chưa có suất chiếu sắp tới.</div>';
      return;
    }
    strip.innerHTML = dates.map((date) => {
      const label = dateLabel(date);
      const weekday = label.split(',')[0];
      return `<button class="date-box ${date === state.dateIso ? 'active' : ''}" type="button" data-select-date="${esc(date)}"><span>${esc(weekday)}</span><strong>${esc(shortDate(date))}</strong></button>`;
    }).join('');
  }

  function filteredShowtimes() {
    return catalog.showtimes.filter((item) => item.date === state.dateIso && item.movieCode === state.movieCode && (!cinemaFilter || item.cinemaId === cinemaFilter));
  }

  function renderSchedule() {
    ensureDateSelection();
    renderDateStrip();
    const host = $('showtimeGroups');
    if (!host) return;
    const allMatches = catalog.showtimes.filter((item) => item.date === state.dateIso && item.movieCode === state.movieCode);
    const availableCinemas = catalog.cinemas.filter((cinema) => allMatches.some((item) => item.cinemaId === cinema.id));
    const filters = `<div class="city-pills" style="margin:14px 0 18px;">
      <button type="button" class="pill ${cinemaFilter ? '' : 'active'}" data-select-cinema="">Tất cả rạp</button>
      ${availableCinemas.map((cinema) => `<button type="button" class="pill ${cinemaFilter === cinema.id ? 'active' : ''}" data-select-cinema="${esc(cinema.id)}">${esc(cinema.name)}</button>`).join('')}
    </div>`;
    const list = filteredShowtimes();
    if (!list.length) {
      host.innerHTML = filters + '<div class="empty-state-box">Không có suất phù hợp với phim/rạp/ngày đang chọn. Hãy đổi ngày hoặc rạp.</div>';
      renderQuickControls();
      return;
    }
    const groups = new Map();
    for (const showtime of list) {
      if (!groups.has(showtime.cinemaId)) groups.set(showtime.cinemaId, []);
      groups.get(showtime.cinemaId).push(showtime);
    }
    host.innerHTML = filters + [...groups.entries()].map(([cinemaId, times]) => {
      const cinema = catalog.cinemas.find((item) => item.id === cinemaId) || times[0];
      const first = times[0];
      return `<section class="cinema-showtime-card ${cinemaId === cinemaFilter ? 'selected-showtime-cinema' : ''}">
        <div><h3 style="font-size:1.1rem;margin-bottom:4px;">${esc(cinema.name)}</h3><p style="font-size:.78rem;color:var(--text-muted);">${esc(cinema.address || '')} • ${esc(cinema.city || '')}</p></div>
        <div><div style="font-size:.76rem;color:var(--text-muted);">${esc(first.format || '2D phụ đề')} • ${esc(state.movie)}</div><div class="time-slots">
          ${times.map((showtime) => `<button type="button" class="slot-btn ${selectedShowtime?.id === showtime.id ? 'active' : ''}" data-pick-showtime="${esc(showtime.id)}"><strong>${esc(showtime.time)}</strong><small>${esc(showtime.room)}</small></button>`).join('')}
        </div></div></section>`;
    }).join('');
    renderQuickControls();
  }

  function renderQuickControls() {
    const cinemaSelect = $('quickCinemaSelect');
    const dateSelect = $('quickDateSelect');
    const timeSelect = $('quickTimeSelect');
    const movieSelect = $('quickMovieSelect');
    if (movieSelect && state.movieCode) movieSelect.value = state.movieCode;
    if (cinemaSelect) {
      cinemaSelect.innerHTML = `<option value="">Tất cả rạp</option>${catalog.cinemas.map((cinema) => `<option value="${esc(cinema.id)}">${esc(cinema.name)}</option>`).join('')}`;
      cinemaSelect.value = cinemaFilter;
    }
    if (dateSelect) {
      dateSelect.innerHTML = availableDates().map((date) => `<option value="${esc(date)}">${esc(shortDate(date))}</option>`).join('');
      if (state.dateIso) dateSelect.value = state.dateIso;
    }
    if (timeSelect) {
      const options = filteredShowtimes();
      timeSelect.innerHTML = options.map((item) => `<option value="${esc(item.id)}">${esc(item.time)} • ${esc(item.room)}</option>`).join('');
      if (selectedShowtime && options.some((item) => item.id === selectedShowtime.id)) timeSelect.value = String(selectedShowtime.id);
      timeSelect.disabled = !options.length;
    }
  }

  function applyShowtime(showtime, clearSeats = true) {
    selectedShowtime = showtime || null;
    if (clearSeats) state.selectedSeats = [];
    state.showtimeId = showtime?.id || null;
    state.movieCode = showtime?.movieCode || state.movieCode;
    state.cinemaId = showtime?.cinemaId || '';
    state.cinema = showtime?.cinema || '';
    state.room = showtime?.room || '';
    state.dateIso = showtime?.date || state.dateIso;
    state.date = dateLabel(state.dateIso);
    state.time = showtime?.time || '';
    renderQuickControls();
    syncSummaryUI();
    renderSeatMap();
  }

  async function chooseShowtime(id) {
    const showtime = catalog.showtimes.find((item) => String(item.id) === String(id));
    if (!showtime) return alert('Suất chiếu không còn trong lịch. Hãy tải lại lịch.');
    cinemaFilter = showtime.cinemaId;
    applyShowtime(showtime);
    renderSchedule();
    goScreen('seats');
  }

  function renderConcessions() {
    const host = $('popcornCatalogGrid');
    if (!host) return;
    for (const item of catalog.concessions) {
      state.foodQtys[item.key] = 0;
      state.foodOptions[item.key] = item.options?.[0] || '';
      state.foodPrices[item.key] = Number(item.price);
      state.foodNames[item.key] = item.name;
    }
    host.innerHTML = catalog.concessions.map((item) => `
      <article class="combo-card food-item-card" data-cat="${esc(item.category)}" id="foodCard_${esc(item.key)}">
        <img loading="lazy" src="${esc(item.image)}" alt="${esc(item.name)}">
        <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:6px;"><h3>${esc(item.name)}</h3><strong style="color:var(--pink-light);white-space:nowrap;">${money(item.price)}</strong></div>
        <p style="font-size:.78rem;color:var(--text-muted);margin-bottom:12px;">${esc(item.description || '')}</p>
        <div class="option-pills">${(item.options || []).map((choice, index) => `<button type="button" class="opt-btn ${index === 0 ? 'selected' : ''}" data-food-choice="${esc(item.key)}" data-choice="${esc(choice)}">${index === 0 ? '✓ ' : ''}${esc(choice)}</button>`).join('')}</div>
        <div class="qty-bar"><span>Số lượng</span><div style="display:flex;gap:14px;align-items:center;">
          <button type="button" data-food-delta="-1" data-food-key="${esc(item.key)}" aria-label="Giảm ${esc(item.name)}">−</button><strong id="qty_${esc(item.key)}">0</strong>
          <button type="button" data-food-delta="1" data-food-key="${esc(item.key)}" aria-label="Tăng ${esc(item.name)}">+</button></div></div>
      </article>`).join('');
  }

  function renderSeatMap() {
    const host = $('seatGridContainer');
    if (!host) return;
    if (!selectedShowtime) {
      host.innerHTML = '<div class="empty-state-box">Hãy chọn một suất chiếu trước khi chọn ghế.</div>';
      soldSeats = new Set();
      syncSummaryUI();
      return;
    }
    api.request(`/api/showtimes/${encodeURIComponent(selectedShowtime.id)}/seats`).then((result) => {
      if (!selectedShowtime || String(result.showtime.id) !== String(selectedShowtime.id)) return;
      soldSeats = new Set(result.soldSeats || []);
      if (stats.soldSeatsByShowtime) stats.soldSeatsByShowtime[String(selectedShowtime.id)] = soldSeats.size;
      const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
      host.innerHTML = rows.map((row) => `<div class="seat-row"><span class="row-label">${row}</span>${Array.from({ length: 12 }, (_, index) => {
        const code = `${row}${String(index + 1).padStart(2, '0')}`;
        const isVip = ['D', 'E', 'F'].includes(row);
        const isSold = soldSeats.has(code);
        const isSelected = state.selectedSeats.some((seat) => seat.code === code);
        return `<button type="button" class="seat-cell ${isVip ? 'vip' : ''} ${isSold ? 'sold' : ''} ${isSelected ? 'selected' : ''}" ${isSold ? 'disabled' : ''} data-seat="${code}" aria-label="Ghế ${code}${isSold ? ', đã bán' : ''}">${isSold ? '×' : String(index + 1).padStart(2, '0')}</button>`;
      }).join('')}<span class="row-label">${row}</span></div>`).join('') + `<div class="seat-row"><span class="row-label">G</span>${Array.from({ length: 6 }, (_, index) => {
        const code = `G0${index + 1}`;
        const isSold = soldSeats.has(code);
        const isSelected = state.selectedSeats.some((seat) => seat.code === code);
        return `<button type="button" class="seat-cell couple ${isSold ? 'sold' : ''} ${isSelected ? 'selected' : ''}" ${isSold ? 'disabled' : ''} data-seat="${code}" aria-label="Ghế đôi ${code}${isSold ? ', đã bán' : ''}">${isSold ? '×' : `Đôi ${code}`}</button>`;
      }).join('')}<span class="row-label">G</span></div>`;
      syncSummaryUI();
    }).catch((error) => {
      host.innerHTML = `<div class="empty-state-box">${esc(error.message)}</div>`;
    });
  }

  function toggleSeat(code) {
    if (!selectedShowtime || soldSeats.has(code)) return;
    const existing = state.selectedSeats.findIndex((seat) => seat.code === code);
    if (existing >= 0) state.selectedSeats.splice(existing, 1);
    else {
      if (state.selectedSeats.length >= 8) return alert('Mỗi đơn demo chọn tối đa 8 ghế.');
      const row = code[0];
      const base = Number(selectedShowtime.basePrice || 95000);
      const price = row === 'G' ? base * 2 : ['D', 'E', 'F'].includes(row) ? base + 20000 : base;
      const type = row === 'G' ? 'Ghế đôi' : ['D', 'E', 'F'].includes(row) ? 'Ghế VIP' : 'Ghế thường';
      state.selectedSeats.push({ code, type, price });
    }
    renderSeatMap();
    syncSummaryUI();
  }

  function setDate(date) {
    if (!availableDates().includes(date)) return;
    state.dateIso = date;
    state.date = dateLabel(date);
    state.selectedSeats = [];
    const possible = catalog.showtimes.filter((item) => item.date === date && item.movieCode === state.movieCode);
    if (cinemaFilter && !possible.some((item) => item.cinemaId === cinemaFilter)) cinemaFilter = '';
    const filtered = possible.filter((item) => !cinemaFilter || item.cinemaId === cinemaFilter);
    selectedShowtime = filtered.find((item) => item.id === selectedShowtime?.id) || filtered[0] || null;
    if (selectedShowtime) applyShowtime(selectedShowtime);
    else { state.showtimeId = null; state.cinema = ''; state.room = ''; state.time = ''; renderSchedule(); renderSeatMap(); syncSummaryUI(); }
    renderSchedule();
  }

  function setCinema(cinemaId) {
    cinemaFilter = cinemaId;
    const times = catalog.showtimes.filter((item) => item.date === state.dateIso && item.movieCode === state.movieCode && (!cinemaFilter || item.cinemaId === cinemaFilter));
    selectedShowtime = times.find((item) => item.id === selectedShowtime?.id) || times[0] || null;
    state.selectedSeats = [];
    if (selectedShowtime) applyShowtime(selectedShowtime);
    else { state.showtimeId = null; state.cinema = catalog.cinemas.find((item) => item.id === cinemaId)?.name || ''; state.room = ''; state.time = ''; renderSeatMap(); syncSummaryUI(); }
    renderSchedule();
  }

  function syncSummaryUI() {
    const hasSeats = Boolean(state.selectedSeats?.length);
    const seatNames = hasSeats ? state.selectedSeats.map((seat) => seat.code).join(', ') : 'Chưa chọn';
    const ticketTotal = (state.selectedSeats || []).reduce((sum, seat) => sum + Number(seat.price || 0), 0);
    const foodLines = [];
    let foodTotal = 0;
    for (const [key, rawQuantity] of Object.entries(state.foodQtys || {})) {
      const quantity = Math.max(0, Number(rawQuantity || 0));
      if (!quantity) continue;
      const unit = Number(state.foodPrices[key] || 0);
      foodTotal += quantity * unit;
      foodLines.push(`${quantity}x ${state.foodNames[key] || key} (${state.foodOptions[key] || 'Mặc định'})`);
    }
    const movie = currentMovie();
    if (movie) syncMovieDetail(movie);
    const dateTime = `${state.date || dateLabel(state.dateIso)} • ${state.time || '—'}`;
    setText('chosenShowtimeBar', selectedShowtime ? `${state.cinema} • ${dateTime}` : 'Vui lòng chọn suất chiếu');
    document.querySelectorAll('.sumRoomName').forEach((element) => { element.textContent = state.room || '—'; });
    document.querySelectorAll('.sumCinemaName').forEach((element) => { element.textContent = state.cinema || '—'; });
    document.querySelectorAll('.sumDateTime').forEach((element) => { element.textContent = dateTime; });
    document.querySelectorAll('.sumSeatBadge').forEach((element) => { element.textContent = hasSeats ? `Ghế ${seatNames}` : 'Chưa chọn ghế'; });
    document.querySelectorAll('.sumSeatShort').forEach((element) => { element.textContent = hasSeats ? seatNames : 'Chưa chọn'; });
    document.querySelectorAll('.sumTicketCount').forEach((element) => { element.textContent = `${state.selectedSeats.length} vé đã chọn`; });
    document.querySelectorAll('.sumTicketMoney').forEach((element) => { element.textContent = money(ticketTotal); });
    document.querySelectorAll('.sumComboLabel').forEach((element) => { element.textContent = foodLines.length ? foodLines.join(' + ') : 'Không chọn bắp nước'; });
    document.querySelectorAll('.sumComboMoney').forEach((element) => { element.textContent = money(foodTotal); });
    document.querySelectorAll('.sumGrandTotal').forEach((element) => { element.textContent = money(ticketTotal + foodTotal); });
    setText('seatBannerText', hasSeats ? `✓ Bạn đã chọn ghế: ${seatNames}` : 'Bạn chưa chọn ghế nào');
    setText('seatBannerPrice', money(ticketTotal));
  }

  function pickOption(key, choice, button) {
    state.foodOptions[key] = choice;
    const card = button.closest('.food-item-card');
    card?.querySelectorAll('.opt-btn').forEach((element) => {
      element.classList.toggle('selected', element === button);
      element.textContent = element.dataset.choice === choice ? `✓ ${choice}` : choice;
    });
    syncSummaryUI();
  }

  function updateFoodItem(key, delta) {
    if (!(key in state.foodQtys)) return;
    state.foodQtys[key] = Math.max(0, Math.min(20, Number(state.foodQtys[key] || 0) + Number(delta)));
    setText(`qty_${key}`, String(state.foodQtys[key]));
    $(`foodCard_${key}`)?.classList.toggle('active-combo', state.foodQtys[key] > 0);
    syncSummaryUI();
  }

  function filterPopcornCat(element, category) {
    document.querySelectorAll('#popcornFilterPills .pill').forEach((pill) => pill.classList.toggle('active', pill === element));
    document.querySelectorAll('.food-item-card').forEach((card) => card.classList.toggle('hidden', category !== 'all' && card.dataset.cat !== category));
  }

  function selectPayMethod(element, method) {
    if (!['Ví MoMo / QR Cinetix', 'ATM nội địa', 'Thẻ quốc tế'].includes(method)) return;
    document.querySelectorAll('.pay-method-item').forEach((item) => item.classList.toggle('active', item === element));
    state.payMethod = method;
  }

  function syncAuthUI() {
    const user = currentUser;
    const loginButton = $('btnNavAuth');
    const profilePill = $('userProfilePill');
    const hint = $('checkoutAuthHint');
    const adminButton = $('adminNavEntry');
    const adminFooter = $('adminFooterSection');
    const adminTicketButton = $('finalAdminButton');
    if (!user) {
      loginButton?.classList.remove('hidden');
      profilePill?.classList.add('hidden');
      hint?.classList.remove('hidden');
      adminButton?.classList.add('hidden');
      adminFooter?.classList.add('hidden');
      adminTicketButton?.classList.add('hidden');
      setText('profGreetingName', 'Bạn');
      setText('profAvatarCircle', '--');
      setText('profCardName', 'Chưa đăng nhập');
      setValue('profNameInput', ''); setValue('profEmailInput', ''); setValue('profPhoneInput', ''); setValue('profDobInput', '');
      return;
    }
    loginButton?.classList.add('hidden');
    profilePill?.classList.remove('hidden');
    hint?.classList.add('hidden');
    const initials = (user.name || 'U').trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase();
    setText('navAvatarDot', initials);
    setText('navUserName', (user.name || '').trim().split(/\s+/).slice(-2).join(' '));
    setText('profGreetingName', (user.name || '').trim().split(/\s+/).slice(-2).join(' '));
    setText('profAvatarCircle', initials);
    setText('profCardName', user.name);
    setValue('profNameInput', user.name); setValue('profEmailInput', user.email); setValue('profPhoneInput', user.phone); setValue('profDobInput', user.dob || '');
    setValue('checkoutName', user.name); setValue('checkoutPhone', user.phone); setValue('checkoutEmail', user.email);
    const isAdmin = user.role === 'admin';
    adminButton?.classList.toggle('hidden', !isAdmin);
    adminFooter?.classList.toggle('hidden', !isAdmin);
    adminTicketButton?.classList.toggle('hidden', !isAdmin);
    setText('adminAccountName', user.name);
  }

  async function loadProfile() {
    if (!currentUser) return;
    const result = await api.request('/api/profile');
    const bookings = result.bookings || [];
    profileBookings = bookings;
    const ticketCount = bookings.reduce((sum, booking) => sum + Number(booking.seatCount || 0), 0);
    const upcoming = bookings.filter(todayForTicket).reduce((sum, booking) => sum + Number(booking.seatCount || 0), 0);
    const spent = bookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0);
    setText('profTotalTickets', String(ticketCount));
    setText('profUpcomingTickets', String(upcoming));
    setText('profTotalSpent', money(spent));
    const host = $('profileHistoryList');
    if (!bookings.length) {
      host.innerHTML = '<div class="empty-state-box">Chưa có vé demo nào. Hãy chọn phim và đặt vé để xem lịch sử tại đây.</div>';
      return;
    }
    host.innerHTML = bookings.map((booking) => {
      const status = todayForTicket(booking) ? 'SẮP CHIẾU (DEMO)' : 'ĐÃ CHIẾU (DEMO)';
      return `<article class="history-card-featured"><div class="history-card-top"><span>${esc(booking.code)} • ${esc(booking.payMethod)}</span><span class="badge-outline">${status}</span></div>
        <div class="history-card-body"><img loading="lazy" src="${esc(booking.poster)}" alt="${esc(booking.movie)}"><div>
          <h3 style="font-size:1.25rem;font-weight:800;margin-bottom:6px;">${esc(booking.movie)}</h3>
          <p style="font-size:.86rem;color:var(--text-white);margin-bottom:4px;">${esc(booking.cinema)} • ${esc(dateLabel(booking.date))} • ${esc(booking.time)}</p>
          <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:4px;">${esc(booking.room)} • Ghế ${esc(booking.seats)} (${Number(booking.seatCount)} vé)</p>
          <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:10px;">${esc(booking.comboText)}</p><strong style="font-size:1.15rem;color:var(--pink-light);">${money(booking.total)}</strong>
        </div><div><button class="btn-dark" type="button" data-view-ticket="${esc(booking.code)}">Xem vé demo</button></div></div></article>`;
    }).join('');
  }

  function displayTicket(ticket) {
    lastTicket = ticket;
    setText('ticketHolderShort', (ticket.customer || 'bạn').trim().split(/\s+/).slice(-2).join(' '));
    setText('finalTicketCode', `VÉ ĐIỆN TỬ DEMO / ${ticket.code}`);
    setText('finalMovieTitle', ticket.movie);
    setText('finalCinema', ticket.cinema);
    setText('finalDate', dateLabel(ticket.date));
    setText('finalTime', ticket.time);
    setText('finalRoom', ticket.room);
    setText('finalSeats', ticket.seats);
    setText('finalCustName', ticket.customer);
    setText('finalTicketCount', `${ticket.seatCount} vé`);
    setText('finalComboText', ticket.comboText || 'Không kèm bắp nước');
    setText('finalPayMethodText', `Mô phỏng: ${ticket.payMethod}`);
    setText('finalTotalMoney', money(ticket.total));
    const movie = moviesCatalog.find((item) => item.title === ticket.movie);
    const poster = ticket.poster || movie?.poster;
    if (poster) document.querySelectorAll('.sumMoviePoster').forEach((image) => { image.src = poster; image.alt = ticket.movie; });
    const qr = $('finalTicketQrImg');
    if (qr) qr.src = demoQrDataUri(ticket.code);
  }

  async function handleRegister() {
    const name = $('regName').value.trim();
    const email = $('regEmail').value.trim();
    const phone = $('regPhone').value.trim();
    const password = $('regPassword').value;
    const confirmPassword = $('regPasswordConfirm').value;
    if (!name || !email || !phone || !password) return alert('Vui lòng điền đầy đủ họ tên, email, số điện thoại và mật khẩu.');
    if (password.length < 6) return alert('Mật khẩu cần có ít nhất 6 ký tự.');
    if (password !== confirmPassword) return alert('Mật khẩu xác nhận không khớp.');
    try {
      const result = await api.request('/api/auth/register', { method: 'POST', body: { name, email, phone, password } });
      currentUser = result.user;
      $('regPassword').value = ''; $('regPasswordConfirm').value = '';
      syncAuthUI();
      alert('Tạo tài khoản demo thành công. Hồ sơ đã được lưu trên máy chủ.');
      goScreen('profile');
    } catch (error) { alert(error.message); }
  }

  async function handleLogin() {
    const email = $('loginEmail').value.trim();
    const password = $('loginPassword').value;
    if (!email || !password) return alert('Vui lòng nhập email và mật khẩu.');
    try {
      const result = await api.request('/api/auth/login', { method: 'POST', body: { email, password } });
      currentUser = result.user;
      $('loginPassword').value = '';
      syncAuthUI();
      alert('Đăng nhập Cinetix thành công.');
      goScreen(currentUser.role === 'admin' ? 'admin-overview' : 'profile');
    } catch (error) { alert(error.message); }
  }

  async function handleLogout() {
    try { await api.request('/api/auth/logout', { method: 'POST', body: {} }); }
    catch (error) { if (error.status !== 401) { alert(error.message); return; } }
    currentUser = null;
    syncAuthUI();
    goScreen('home');
  }

  async function saveUserProfile() {
    if (!currentUser) return goScreen('auth');
    const name = $('profNameInput').value.trim();
    const email = $('profEmailInput').value.trim();
    const phone = $('profPhoneInput').value.trim();
    const dob = $('profDobInput').value;
    if (!name || !email) return alert('Họ tên và email không được để trống.');
    try {
      const result = await api.request('/api/profile', { method: 'PUT', body: { name, email, phone, dob } });
      currentUser = result.user;
      syncAuthUI();
      alert('Hồ sơ đã được cập nhật trong cơ sở dữ liệu.');
    } catch (error) { alert(error.message); }
  }

  function openQrPaymentModal() {
    if (!selectedShowtime || !state.showtimeId) return alert('Vui lòng chọn suất chiếu trước.');
    if (!state.selectedSeats.length) { alert('Bạn chưa chọn ghế nào.'); goScreen('seats'); return; }
    const name = $('checkoutName').value.trim();
    const phone = $('checkoutPhone').value.trim();
    const email = $('checkoutEmail').value.trim();
    if (!name || !phone || !email) return alert('Vui lòng nhập đủ họ tên, số điện thoại và email nhận vé.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Email chưa đúng định dạng.');
    if (!$('checkoutTerms').checked) return alert('Vui lòng đồng ý điều khoản và xác nhận độ tuổi.');
    const qr = $('checkoutQrImg');
    if (qr) qr.src = demoQrDataUri('CINETIX-DEMO-PAYMENT');
    $('qrPaymentModal').classList.remove('hidden');
  }

  async function completeBooking() {
    if (bookingBusy) return;
    if (!selectedShowtime || !state.selectedSeats.length) return alert('Vui lòng chọn lại suất chiếu và ghế.');
    const items = Object.entries(state.foodQtys).filter(([, quantity]) => Number(quantity) > 0).map(([key, quantity]) => ({
      key, quantity: Number(quantity), choice: state.foodOptions[key] || '',
    }));
    const body = {
      showtimeId: selectedShowtime.id,
      seats: state.selectedSeats.map((seat) => seat.code),
      customer: { name: $('checkoutName').value.trim(), phone: $('checkoutPhone').value.trim(), email: $('checkoutEmail').value.trim() },
      payMethod: state.payMethod,
      termsAccepted: $('checkoutTerms').checked,
      items,
    };
    bookingBusy = true;
    const button = $('qrPaymentModal')?.querySelector('button.btn-pink');
    if (button) { button.disabled = true; button.textContent = 'Đang lưu đơn demo…'; }
    try {
      const result = await api.request('/api/bookings', { method: 'POST', body });
      const ticket = result.booking;
      $('qrPaymentModal').classList.add('hidden');
      displayTicket(ticket);
      state.selectedSeats = [];
      for (const key of Object.keys(state.foodQtys)) {
        state.foodQtys[key] = 0;
        setText(`qty_${key}`, '0');
        $(`foodCard_${key}`)?.classList.remove('active-combo');
      }
      await renderSeatMap();
      syncSummaryUI();
      await refreshAllStatsUI();
      goScreen('complete');
    } catch (error) {
      alert(error.message);
      if (error.code === 'seat_unavailable') await renderSeatMap();
    } finally {
      bookingBusy = false;
      if (button) { button.disabled = false; button.textContent = 'Xác nhận mô phỏng →'; }
    }
  }

  async function refreshAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin' || adminRefreshBusy) return;
    adminRefreshBusy = true;
    try {
      adminDashboard = await api.request('/api/admin/dashboard');
      const data = adminDashboard;
      moviesCatalog = (data.movies || []).map(movieFromApi);
      cinemasList = data.cinemas || [];
      roomsList = data.rooms || [];
      registeredUsers = data.users || [];
      staffList = data.staff || [];
      Object.assign(stats, data.stats || {});
      stats.bookings = data.bookings || [];
      renderAdminDashboard();
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        currentUser = null; syncAuthUI(); goScreen('auth');
      } else alert(`Không thể tải quản trị: ${error.message}`);
    } finally { adminRefreshBusy = false; }
  }

  function renderAdminDashboard() {
    const s = stats;
    setText('kpiRevenue', money(s.totalRevenue));
    setText('kpiTickets', String(Number(s.totalTickets || 0)));
    const capacity = Number(s.totalCapacity || 0);
    const occupancy = capacity ? Math.min(100, (Number(s.totalSoldSeats || 0) / capacity) * 100) : 0;
    setText('kpiOccupancy', `${occupancy.toFixed(1).replace('.', ',')}%`);
    setText('kpiMembers', String(Number(s.newMembers || 0)));
    setText('kpiRevenueTrend', `${Number(s.totalOrders || 0)} đơn demo đã ghi`);
    setText('kpiTicketsTrend', `${Number(s.totalTickets || 0)} vé demo`);
    setText('kpiOccupancyTrend', `${Number(s.totalSoldSeats || 0)} / ${capacity} ghế trong lịch sắp tới`);
    setText('kpiMembersTrend', `${Number(s.newMembers || 0)} tài khoản khách`);

    const chart = document.querySelectorAll('.bar-col');
    const today = dateInVietnam(0);
    const days = Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
    const revenue = s.revenueByDay || {};
    const maxRevenue = Math.max(1, ...days.map((date) => Number(revenue[date] || 0)));
    if (chart.length) {
      const bars = [...chart];
      const parent = bars[0].parentElement;
      const axis = parent?.querySelector('.y-axis')?.outerHTML || '';
      for (const node of bars) node.remove();
      if (parent) parent.innerHTML = axis + days.map((date, index) => {
        const amount = Number(revenue[date] || 0);
        const height = amount ? Math.max(5, Math.round(amount / maxRevenue * 100)) : 2;
        return `<div class="bar-col"><div class="bar-fill ${index === 6 ? 'highlight' : ''}" style="height:${height}%;" title="${money(amount)}"></div><span class="bar-label">${esc(shortDate(date))}</span></div>`;
      }).join('');
    }

    const topHost = $('topMoviesProgressList');
    if (topHost) {
      const sortedMovies = [...moviesCatalog].sort((a, b) => Number(s.movieTickets?.[b.title] || 0) - Number(s.movieTickets?.[a.title] || 0)).slice(0, 5);
      const maxTickets = Math.max(1, ...sortedMovies.map((movie) => Number(s.movieTickets?.[movie.title] || 0)));
      topHost.innerHTML = sortedMovies.map((movie) => {
        const count = Number(s.movieTickets?.[movie.title] || 0);
        return `<div class="top-movie-item"><div class="top-movie-head"><strong>${esc(movie.title)}</strong><span style="color:var(--text-muted);">${count} vé</span></div><div class="progress-track"><div class="progress-bar" style="width:${Math.round(count / maxTickets * 100)}%;"></div></div></div>`;
      }).join('');
    }

    const recent = $('adminRecentBookingsBody');
    if (recent) recent.innerHTML = stats.bookings.length ? stats.bookings.slice(0, 8).map((booking) => `<tr><td style="color:white;font-weight:600;">${esc(booking.code)}</td><td>${esc(booking.customer)}</td><td>${esc(booking.movie)}</td><td>${esc(booking.seats)}</td><td>${money(booking.total)}</td><td style="color:var(--amber);font-weight:600;">Đã xác nhận (demo)</td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center;padding:26px;color:var(--text-muted);">Chưa có đơn demo nào.</td></tr>';

    const showtimesBody = $('adminShowtimesBody');
    if (showtimesBody) showtimesBody.innerHTML = (dataShowtimes()).slice(0, 100).map((showtime) => `<tr class="${String(showtime.id) === String(selectedAdminShowtimeId) ? 'active-row' : ''}" data-admin-showtime="${esc(showtime.id)}" style="cursor:pointer;"><td>${esc(showtime.time)}</td><td>${esc(shortDate(showtime.date))}/${esc(partsOfDate(showtime.date).year)}</td><td>${esc(showtime.room)}</td><td>${esc(showtime.format)}</td><td>${money(showtime.basePrice)}</td><td>${Number(showtime.soldCount || 0)} / ${Number(showtime.capacity || 78)} ghế</td><td>${showtime.status === 'on_sale' ? 'Đang mở bán' : 'Đã đóng'}</td></tr>`).join('') || '<tr><td colspan="7">Không có suất chiếu trong lịch.</td></tr>';

    const cinemaBody = $('adminCinemasBody');
    if (cinemaBody) cinemaBody.innerHTML = cinemasList.map((cinema) => `<tr><td>${esc(cinema.id)}</td><td>${esc(cinema.name)}</td><td>${esc(cinema.address)}</td><td>${esc(cinema.city)}</td><td>${esc(cinema.status)}</td><td><button class="btn-dark btn-sm" data-delete-cinema="${esc(cinema.id)}">Xóa</button></td></tr>`).join('') || '<tr><td colspan="6">Chưa có rạp.</td></tr>';

    const roomBody = $('adminRoomsBody');
    if (roomBody) roomBody.innerHTML = roomsList.map((room) => `<tr><td>${esc(room.id)}</td><td>${esc(room.name)}</td><td>${esc(room.cinema)}</td><td>${Number(room.seats)} ghế</td><td>${esc(room.status)}</td><td><button class="btn-dark btn-sm" data-delete-room="${esc(room.id)}">Xóa</button></td></tr>`).join('') || '<tr><td colspan="6">Chưa có phòng chiếu.</td></tr>';

    const usersBody = $('adminUsersBody');
    if (usersBody) usersBody.innerHTML = registeredUsers.length ? registeredUsers.map((user, index) => `<tr><td>${index + 1}</td><td>${esc(user.id)}</td><td>${esc(user.name)}</td><td>${esc(user.email)}</td><td>${esc(user.phone)}</td><td>${esc(user.role)}</td><td>${esc(user.status)}</td><td><button class="btn-dark btn-sm" data-delete-user="${esc(user.id)}">Xóa</button></td></tr>`).join('') : '<tr><td colspan="8" style="text-align:center;padding:26px;color:var(--text-muted);">Chưa có tài khoản khách hàng.</td></tr>';

    const staffBody = $('adminStaffBody');
    if (staffBody) staffBody.innerHTML = staffList.length ? staffList.map((staff, index) => `<tr><td>${index + 1}</td><td>${esc(staff.id)}</td><td>${esc(staff.name)}</td><td>${esc(staff.email)}</td><td>${esc(staff.phone)}</td><td><span class="badge-outline">${esc(staff.role)}</span>${staff.source === 'user' ? '<small> • tài khoản đăng nhập</small>' : ''}</td><td>${esc(staff.status)}</td><td>${staff.source === 'directory' ? `<button class="btn-dark btn-sm" data-delete-staff="${esc(staff.id)}">Xóa</button>` : '—'}</td></tr>`).join('') : '<tr><td colspan="8">Chưa có nhân sự.</td></tr>';

    const revenueBody = $('adminMovieRevenueTableBody');
    if (revenueBody) revenueBody.innerHTML = moviesCatalog.map((movie) => `<tr><td>${esc(movie.title)}</td><td>${esc(movie.genre)}</td><td>${Number(s.movieTickets?.[movie.title] || 0)}</td><td style="color:var(--pink-light);font-weight:700;">${money(s.movieRevenue?.[movie.title] || 0)}</td></tr>`).join('');

    const bookingsBody = $('adminAllBookingsBody');
    if (bookingsBody) bookingsBody.innerHTML = stats.bookings.length ? stats.bookings.map((booking) => `<tr><td>${esc(booking.code)}</td><td>${esc(booking.customer)}</td><td>${esc(booking.movie)}</td><td>${esc(booking.cinema)} (${esc(booking.room)})</td><td>${esc(booking.time)} • ${esc(shortDate(booking.date))}</td><td>${esc(booking.seats)}</td><td>${esc(booking.comboText)}</td><td style="color:var(--green);font-weight:700;">${money(booking.total)}</td></tr>`).join('') : '<tr><td colspan="8" style="text-align:center;padding:26px;color:var(--text-muted);">Chưa có đơn demo nào.</td></tr>';

    renderAdminMovieLibrary();
    setText('scheduleMovieTitle', currentMovie()?.title || 'Chọn phim');
  }

  function dataShowtimes() {
    return adminDashboard?.showtimes || [];
  }

  async function refreshAllStatsUI() {
    if (currentUser?.role === 'admin') await refreshAdminDashboard();
    if (currentUser) {
      try { await loadProfile(); } catch (error) { if (error.status !== 401) console.error('Cinetix profile refresh failed.'); }
    }
  }

  function goScreen(target) {
    if (target === 'profile' && !currentUser) {
      alert('Vui lòng đăng nhập hoặc tạo tài khoản để xem hồ sơ.');
      target = 'auth';
    }
    if (String(target).startsWith('admin') && currentUser?.role !== 'admin') {
      alert('Khu vực quản trị chỉ dành cho tài khoản admin được cấp quyền.');
      target = currentUser ? 'profile' : 'auth';
    }
    if (target === 'complete' && !lastTicket) target = 'home';
    if (['seats', 'popcorn', 'checkout'].includes(target) && !selectedShowtime) {
      alert('Vui lòng chọn một suất chiếu trước.');
      target = 'showtimes';
    }
    if (['popcorn', 'checkout'].includes(target) && !state.selectedSeats.length) {
      alert('Vui lòng chọn ít nhất một ghế.');
      target = 'seats';
    }
    const admin = String(target).startsWith('admin');
    $('clientNavbar')?.classList.toggle('hidden', admin);
    $('clientFooter')?.classList.toggle('hidden', admin);
    $('demoPrivacyNotice')?.classList.toggle('hidden', admin);
    $('adminWrapper')?.classList.toggle('hidden', !admin);
    const screens = ['home', 'showtimes', 'seats', 'popcorn', 'checkout', 'complete', 'profile', 'auth'];
    screens.forEach((screen) => $(`screen-${screen}`)?.classList.toggle('hidden', admin || screen !== target));
    const stepScreens = ['seats', 'popcorn', 'checkout', 'complete'];
    $('stepperBar')?.classList.toggle('hidden', admin || !stepScreens.includes(target));
    const order = ['showtimes', 'seats', 'popcorn', 'checkout', 'complete'];
    const index = order.indexOf(target);
    if (index >= 0) {
      for (let step = 1; step <= 5; step += 1) {
        const node = $(`st-${step}`);
        if (!node) continue;
        const circle = node.querySelector('.step-circle');
        node.classList.toggle('done', step - 1 < index);
        node.classList.toggle('active', step - 1 === index);
        if (circle) circle.textContent = step - 1 < index ? '✓' : String(step);
      }
    }
    if (admin) {
      const view = target.replace('admin-', '');
      currentAdminView = ['overview', 'movies', 'cinemas', 'users', 'staff', 'bookings'].includes(view) ? view : 'overview';
      oldSwitchAdminView?.(currentAdminView);
      refreshAdminDashboard();
    }
    if (target === 'showtimes') renderSchedule();
    if (target === 'seats') renderSeatMap();
    if (target === 'profile') loadProfile().catch((error) => alert(error.message));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function switchAdminView(view) {
    if (currentUser?.role !== 'admin') return alert('Không có quyền quản trị.');
    currentAdminView = view;
    oldSwitchAdminView?.(view);
    await refreshAdminDashboard();
  }

  function quickBook() {
    const id = $('quickTimeSelect')?.value;
    if (!id) return alert('Không có suất phù hợp. Hãy chọn lại phim, ngày hoặc rạp.');
    chooseShowtime(id);
  }

  function selectMovieAndGo(value, openTrailer = false) {
    const movie = moviesCatalog.find((item) => item.title === value || item.code === value);
    if (!movie) return;
    showMovie(movie.code, openTrailer);
    goScreen('showtimes');
    if (openTrailer) $('trailerBox')?.classList.remove('hidden');
  }

  function selectAdminShowtimeRow(rowOrId) {
    const id = typeof rowOrId === 'string' || typeof rowOrId === 'number' ? rowOrId : rowOrId?.dataset?.adminShowtime;
    const showtime = dataShowtimes().find((item) => String(item.id) === String(id));
    if (!showtime) return;
    selectedAdminShowtimeId = showtime.id;
    setText('editSlotHeading', showtime.time);
    setValue('editSlotCinemaName', showtime.cinema);
    setValue('editSlotRoomName', showtime.room);
    setValue('editSlotDateInput', showtime.date);
    setValue('editSlotTimeInput', showtime.time);
    setValue('editSlotPriceInput', Number(showtime.basePrice));
    renderAdminDashboard();
  }

  async function saveShowtimeFromAdmin() {
    if (!selectedAdminShowtimeId) return alert('Chọn một suất chiếu trong bảng trước.');
    try {
      await api.request(`/api/admin/showtimes/${encodeURIComponent(selectedAdminShowtimeId)}`, {
        method: 'PUT',
        body: { date: $('editSlotDateInput').value, time: $('editSlotTimeInput').value, basePrice: Number($('editSlotPriceInput').value), status: 'on_sale' },
      });
      await reloadCatalog();
      await refreshAdminDashboard();
      alert('Đã lưu suất chiếu demo. Lịch sử vé cũ được giữ nguyên.');
    } catch (error) { alert(error.message); }
  }

  function loadMovieToEdit(code) {
    const movie = moviesCatalog.find((item) => item.code === code);
    if (!movie) return;
    document.querySelectorAll('.movie-lib-item').forEach((item) => item.classList.toggle('active', item.dataset.editMovie === code));
    setText('movieFormHeading', 'Chỉnh sửa phim');
    setText('editMovieCode', movie.code);
    setValue('editMovieTitle', movie.title); setValue('editMovieDuration', movie.duration); setValue('editMovieRating', movie.rating);
    setValue('editMovieGenre', movie.genre); setValue('editMovieRelease', movie.release); setValue('editMovieDesc', movie.desc);
    setValue('editMovieStatus', movie.status || 'now_showing');
    setText('scheduleMovieTitle', movie.title);
  }

  function prepareNewMovieForm() {
    setText('movieFormHeading', 'Thêm phim mới');
    setText('editMovieCode', 'Mã phim tự sinh');
    setValue('editMovieTitle', ''); setValue('editMovieDuration', '120 phút'); setValue('editMovieRating', 'P');
    setValue('editMovieGenre', 'Hành động, Phiêu lưu'); setValue('editMovieRelease', ''); setValue('editMovieDesc', ''); setValue('editMovieStatus', 'now_showing');
  }

  async function saveMovieFromAdmin() {
    const title = $('editMovieTitle').value.trim();
    if (!title) return alert('Vui lòng nhập tên phim.');
    const existing = moviesCatalog.find((movie) => movie.code === $('editMovieCode').textContent.trim());
    const body = {
      title,
      duration: $('editMovieDuration').value.trim(),
      rating: $('editMovieRating').value,
      genre: $('editMovieGenre').value.trim(),
      release_text: $('editMovieRelease').value.trim() || 'Đang cập nhật',
      description: $('editMovieDesc').value.trim(),
      director: existing?.director || 'Đạo diễn Cinetix',
      actors: existing?.actor || 'Dàn diễn viên Cinetix',
      poster_url: existing?.poster || moviesCatalog[0]?.poster,
      status: $('editMovieStatus').value,
    };
    try {
      if (existing) await api.request(`/api/admin/movies/${encodeURIComponent(existing.code)}`, { method: 'PUT', body });
      else await api.request('/api/admin/movies', { method: 'POST', body });
      await reloadCatalog();
      await refreshAdminDashboard();
      alert('Đã lưu phim vào cơ sở dữ liệu.');
    } catch (error) { alert(error.message); }
  }

  async function deleteMovieByAdmin(code) {
    const movie = moviesCatalog.find((item) => item.code === code);
    if (!movie || !confirm(`Xóa phim “${movie.title}”? Phim đã có suất chiếu/vé sẽ được giữ lại.`)) return;
    try { await api.request(`/api/admin/movies/${encodeURIComponent(code)}`, { method: 'DELETE' }); await reloadCatalog(); await refreshAdminDashboard(); }
    catch (error) { alert(error.message); }
  }

  async function addCinemaPrompt() {
    const name = prompt('Nhập tên rạp Cinetix mới:'); if (!name) return;
    const city = prompt('Nhập tỉnh/thành phố:'); if (!city) return;
    const address = prompt('Nhập địa chỉ rạp:', 'Trung tâm Thương mại Cinetix') || '';
    try { await api.request('/api/admin/cinemas', { method: 'POST', body: { name, city, address } }); await reloadCatalog(); await refreshAdminDashboard(); }
    catch (error) { alert(error.message); }
  }

  async function deleteCinemaItem(id) {
    if (!confirm('Xóa rạp demo này? Rạp đang có phòng/suất chiếu sẽ không thể xóa.')) return;
    try { await api.request(`/api/admin/cinemas/${encodeURIComponent(id)}`, { method: 'DELETE' }); await reloadCatalog(); await refreshAdminDashboard(); }
    catch (error) { alert(error.message); }
  }

  async function addRoomPrompt() {
    if (!cinemasList.length) return alert('Hãy tạo rạp trước.');
    const choices = cinemasList.map((cinema) => `${cinema.id}: ${cinema.name}`).join('\n');
    const cinemaId = prompt(`Nhập ID rạp cho phòng mới:\n${choices}`, cinemasList[0].id); if (!cinemaId) return;
    const name = prompt('Nhập tên phòng chiếu mới:', 'Phòng 05'); if (!name) return;
    try { await api.request('/api/admin/rooms', { method: 'POST', body: { cinemaId, name, seats: 78 } }); await reloadCatalog(); await refreshAdminDashboard(); }
    catch (error) { alert(error.message); }
  }

  async function deleteRoomItem(id) {
    if (!confirm('Xóa phòng demo này? Phòng có suất chiếu/vé lịch sử sẽ không thể xóa.')) return;
    try { await api.request(`/api/admin/rooms/${encodeURIComponent(id)}`, { method: 'DELETE' }); await reloadCatalog(); await refreshAdminDashboard(); }
    catch (error) { alert(error.message); }
  }

  async function addCustomerByAdmin() {
    const name = prompt('Nhập họ tên khách hàng:'); if (!name) return;
    const email = prompt('Nhập email khách hàng:'); if (!email) return;
    const phone = prompt('Nhập số điện thoại:') || '';
    const password = prompt('Tạo mật khẩu tạm thời tối thiểu 6 ký tự:'); if (!password) return;
    try {
      await api.request('/api/admin/users', { method: 'POST', body: { name, email, phone, password } });
      await refreshAdminDashboard();
      alert('Đã tạo tài khoản khách hàng. Hãy chia sẻ mật khẩu tạm thời an toàn với chủ tài khoản.');
    } catch (error) { alert(error.message); }
  }

  async function deleteUserByAdmin(id) {
    if (!confirm('Xóa tài khoản khách hàng? Các vé/đơn lịch sử và doanh thu vẫn được giữ lại.')) return;
    try { await api.request(`/api/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' }); await refreshAdminDashboard(); }
    catch (error) { alert(error.message); }
  }

  async function addStaffByAdmin() {
    const name = prompt('Nhập họ tên nhân sự:'); if (!name) return;
    const email = prompt('Nhập email nhân sự:'); if (!email) return;
    const phone = prompt('Nhập số điện thoại:') || '';
    const role = prompt('Vai trò trong danh bạ (admin hoặc employee). Danh bạ này không cấp quyền đăng nhập:', 'employee') || 'employee';
    try {
      const result = await api.request('/api/admin/staff', { method: 'POST', body: { name, email, phone, role } });
      await refreshAdminDashboard();
      alert(result.roleNote || 'Đã thêm nhân sự vào danh bạ.');
    } catch (error) { alert(error.message); }
  }

  async function deleteStaffByAdmin(id) {
    if (!confirm('Xóa nhân sự khỏi danh bạ demo?')) return;
    try { await api.request(`/api/admin/staff/${encodeURIComponent(id)}`, { method: 'DELETE' }); await refreshAdminDashboard(); }
    catch (error) { alert(error.message); }
  }

  async function reloadCatalog() {
    const fresh = await api.request('/api/bootstrap');
    catalog = { ...fresh, movies: fresh.movies || [], cinemas: fresh.cinemas || [], rooms: fresh.rooms || [], concessions: fresh.concessions || [], showtimes: fresh.showtimes || [] };
    moviesCatalog = catalog.movies.map(movieFromApi);
    ensureDateSelection();
    if (!moviesCatalog.some((movie) => movie.code === state.movieCode)) {
      const firstMovie = moviesCatalog.find((movie) => movie.status !== 'coming_soon') || moviesCatalog[0];
      if (firstMovie) syncMovieDetail(firstMovie);
    }
    renderMovieCatalog();
    renderConcessions();
    if (state.dateIso) {
      const possible = catalog.showtimes.filter((item) => item.date === state.dateIso && item.movieCode === state.movieCode);
      if (cinemaFilter && !possible.some((item) => item.cinemaId === cinemaFilter)) cinemaFilter = '';
      const filtered = cinemaFilter ? possible.filter((item) => item.cinemaId === cinemaFilter) : possible;
      selectedShowtime = filtered.find((item) => String(item.id) === String(state.showtimeId)) || filtered[0] || null;
      if (selectedShowtime) applyShowtime(selectedShowtime);
      else { state.showtimeId = null; state.cinema = ''; state.room = ''; state.time = ''; }
    }
    renderSchedule();
    syncSummaryUI();
  }

  async function bootstrapApp() {
    try {
      const data = await api.request('/api/bootstrap');
      catalog = { ...data, movies: data.movies || [], cinemas: data.cinemas || [], rooms: data.rooms || [], concessions: data.concessions || [], showtimes: data.showtimes || [] };
      moviesCatalog = catalog.movies.map(movieFromApi);
      ensureDateSelection();
      const initialMovie = moviesCatalog.find((movie) => movie.status === 'now_showing') || moviesCatalog[0];
      if (initialMovie) syncMovieDetail(initialMovie);
      const initialSlot = catalog.showtimes.find((showtime) => showtime.movieCode === initialMovie?.code && showtime.date === state.dateIso) || catalog.showtimes[0];
      if (initialSlot) applyShowtime(initialSlot);
      renderMovieCatalog();
      renderConcessions();
      renderDateStrip();
      renderSchedule();
      const session = await api.request('/api/session');
      currentUser = session.user || null;
      syncAuthUI();
      syncSummaryUI();
      renderSeatMap();
    } catch (error) {
      console.error('Cinetix initialization failed.');
      const notice = $('demoPrivacyNotice');
      if (notice) notice.innerHTML = `<div class="container"><strong>Máy chủ Cinetix chưa sẵn sàng.</strong> ${esc(error.message)} Vui lòng thử tải lại sau.</div>`;
    }
  }

  document.addEventListener('change', (event) => {
    if (event.target.id === 'quickMovieSelect') showMovie(event.target.value);
    if (event.target.id === 'quickCinemaSelect') setCinema(event.target.value);
    if (event.target.id === 'quickDateSelect') setDate(event.target.value);
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-movie-code],[data-pick-showtime],[data-select-date],[data-select-cinema],[data-seat],[data-food-delta],[data-food-choice],[data-view-ticket],[data-edit-movie],[data-delete-movie],[data-admin-showtime],[data-delete-cinema],[data-delete-room],[data-delete-user],[data-delete-staff]');
    if (!target) return;
    if (Object.prototype.hasOwnProperty.call(target.dataset, 'selectCinema')) return setCinema(target.dataset.selectCinema);
    if (target.dataset.movieCode) return selectMovieAndGo(target.dataset.movieCode);
    if (target.dataset.pickShowtime) return chooseShowtime(target.dataset.pickShowtime);
    if (target.dataset.selectDate) return setDate(target.dataset.selectDate);
    if (target.dataset.seat) return toggleSeat(target.dataset.seat);
    if (target.dataset.foodDelta) return updateFoodItem(target.dataset.foodKey, Number(target.dataset.foodDelta));
    if (target.dataset.foodChoice) return pickOption(target.dataset.foodChoice, target.dataset.choice, target);
    if (target.dataset.viewTicket) {
      const booking = [...profileBookings, ...(adminDashboard?.bookings || [])].find((item) => item.code === target.dataset.viewTicket);
      if (booking) { displayTicket(booking); goScreen('complete'); }
      else alert('Không tìm thấy vé demo. Hãy tải lại lịch sử vé.');
      return;
    }
    if (target.dataset.editMovie) return loadMovieToEdit(target.dataset.editMovie);
    if (target.dataset.deleteMovie) { event.stopPropagation(); return deleteMovieByAdmin(target.dataset.deleteMovie); }
    if (target.dataset.adminShowtime) return selectAdminShowtimeRow(target.dataset.adminShowtime);
    if (target.dataset.deleteCinema) return deleteCinemaItem(target.dataset.deleteCinema);
    if (target.dataset.deleteRoom) return deleteRoomItem(target.dataset.deleteRoom);
    if (target.dataset.deleteUser) return deleteUserByAdmin(target.dataset.deleteUser);
    if (target.dataset.deleteStaff) return deleteStaffByAdmin(target.dataset.deleteStaff);
  });

  window.syncAuthUI = syncAuthUI;
  window.syncSummaryUI = syncSummaryUI;
  window.refreshAllStatsUI = refreshAllStatsUI;
  window.renderMoviesCatalog = renderMovieCatalog;
  window.renderSeatMap = renderSeatMap;
  window.toggleSeat = toggleSeat;
  window.selectDate = (_element, date) => setDate(date);
  window.pickShowtime = (_button, cinema, time, room, id) => id ? chooseShowtime(id) : null;
  window.changeMovieSelection = showMovie;
  window.selectMovieAndGo = selectMovieAndGo;
  window.quickBook = quickBook;
  window.goScreen = goScreen;
  window.switchAdminView = switchAdminView;
  window.handleRegister = handleRegister;
  window.handleLogin = handleLogin;
  window.handleLogout = handleLogout;
  window.saveUserProfile = saveUserProfile;
  window.proceedFromSeats = () => state.selectedSeats.length ? goScreen('popcorn') : alert('Vui lòng chọn ghế trước.');
  window.openQrPaymentModal = openQrPaymentModal;
  window.closeQrPaymentModal = () => $('qrPaymentModal')?.classList.add('hidden');
  window.completeBooking = completeBooking;
  window.selectPayMethod = selectPayMethod;
  window.updateFoodItem = updateFoodItem;
  window.filterPopcornCat = filterPopcornCat;
  window.pickSingleOpt = (button) => {
    const card = button.closest('.food-item-card');
    if (card) pickOption(card.id.replace('foodCard_', ''), button.textContent.replace(/^✓\s*/, '').trim(), button);
  };
  window.saveShowtimeFromAdmin = saveShowtimeFromAdmin;
  window.selectAdminShowtimeRow = selectAdminShowtimeRow;
  window.loadMovieToEdit = (_element, code) => loadMovieToEdit(code);
  window.prepareNewMovieForm = prepareNewMovieForm;
  window.saveMovieFromAdmin = saveMovieFromAdmin;
  window.deleteMovieByAdmin = deleteMovieByAdmin;
  window.addCinemaPrompt = addCinemaPrompt;
  window.deleteCinemaItem = deleteCinemaItem;
  window.addRoomPrompt = addRoomPrompt;
  window.deleteRoomItem = deleteRoomItem;
  window.addCustomerByAdmin = addCustomerByAdmin;
  window.deleteUserByAdmin = deleteUserByAdmin;
  window.addStaffByAdmin = addStaffByAdmin;
  window.deleteStaffByAdmin = deleteStaffByAdmin;
  window.resetAllSystemData = () => alert('Không có chức năng xóa/reset toàn bộ database trên website live.');

  bootstrapApp();
}());
