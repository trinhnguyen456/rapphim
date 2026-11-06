// DANH SÁCH 8 PHIM KẾT HỢP (4 PHIM INDEX.HTML + 4 PHIM BÁO CÁO HÌNH 5.1)
    let moviesCatalog = [
        {
            code: 'PH-001',
            title: 'Dưới bầu trời sao',
            genre: 'Khoa học viễn tưởng, Phiêu lưu',
            duration: '128 phút',
            rating: 'T13',
            release: '23/10/2026',
            director: 'Nguyễn Minh Khôi',
            actor: 'Trần Ngọc An, Lê Hoàng, Phạm Hà',
            desc: 'Năm 2086, Trái Đất dần mất đi ánh sáng. Phi hành gia An cùng một đội thám hiểm đi theo tín hiệu bí ẩn từ thiên hà xa xôi để tìm lại hy vọng cho Trái Đất.',
            poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80'
        },
        {
            code: 'PH-002',
            title: 'Thành phố không ngủ',
            genre: 'Tình cảm, Đô thị',
            duration: '112 phút',
            rating: 'T16',
            release: '16/10/2026',
            director: 'Lê Thanh Sơn',
            actor: 'Tuấn Trần, Phương Anh Đào',
            desc: 'Những cuộc gặp gỡ tình cờ giữa lòng Sài Gòn về đêm của hai tâm hồn cô đơn.',
            poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
        },
        {
            code: 'PH-003',
            title: 'Sau cánh rừng',
            genre: 'Bí ẩn, Giật gân',
            duration: '105 phút',
            rating: 'T18',
            release: '23/10/2026',
            director: 'Trần Hữu Tấn',
            actor: 'Hoàng Hà, Quốc Trường',
            desc: 'Bí mật bị chôn vùi hàng thập kỷ trong khu rừng sương mù dần hé lộ.',
            poster: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
        },
        {
            code: 'PH-004',
            title: 'Mùa hè rực rỡ',
            genre: 'Thanh xuân, Gia đình',
            duration: '118 phút',
            rating: 'K',
            release: '09/10/2026',
            director: 'Vũ Ngọc Đãng',
            actor: 'Kaity Nguyễn, Anh Tú',
            desc: 'Chuyến đi biển cuối cùng của nhóm bạn thân trước ngưỡng cửa trưởng thành.',
            poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
        },
        {
            code: 'PH-005',
            title: 'LILO & STITCH',
            genre: 'Gia đình, Hài, Phiêu Lưu',
            duration: '107 phút',
            rating: 'P',
            release: '23/05/2025',
            director: 'Dean Fleischer Camp',
            actor: 'Maia Kealoha, Sydney Elizabeth Agudong, Tia Carrere',
            desc: 'Phiên bản live action kể lại câu chuyện cảm động giữa cô bé Lilo và sinh vật ngoài hành tinh Stitch.',
            poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80'
        },
        {
            code: 'PH-006',
            title: 'TỪ VŨ TRỤ JOHN WICK: BALLERINA',
            genre: 'Hành Động, Hồi hộp',
            duration: '125 phút',
            rating: 'T18',
            release: '06/06/2025',
            director: 'Len Wiseman',
            actor: 'Ana de Armas, Keanu Reeves, Ian McShane',
            desc: 'Nữ sát thủ trẻ tuổi tìm kiếm sự trả thù cho gia đình mình trong thế giới ngầm John Wick.',
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
        },
        {
            code: 'PH-007',
            title: 'BỘ 5 SIÊU ĐẲNG CẤP',
            genre: 'Hài, Hành Động, Thần thoại',
            duration: '119 phút',
            rating: 'T16',
            release: '13/07/2025',
            director: 'Kang Hyeong-cheol',
            actor: 'Lee Jae-in, Yoo Ah-in, Ra Mi-ran',
            desc: 'Năm người bình thường bất ngờ nhận được siêu năng lực sau ca ghép tạng bí ẩn.',
            poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
        },
        {
            code: 'PH-008',
            title: 'DƯỚI ĐÁY HỒ',
            genre: 'Kinh dị, Bí ẩn',
            duration: '102 phút',
            rating: 'T18',
            release: '15/08/2025',
            director: 'Trần Hữu Tấn',
            actor: 'Kay Trần, Thanh Duy, Karen Nguyễn',
            desc: 'Truyền thuyết đô thị kỳ bí về hồ nước tử thần tại làng đại học.',
            poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80'
        }
    ];

    // DANH SÁCH RẠP & PHÒNG CHIẾU (HÌNH 5.16)
    let cinemasList = [
        { id: 'LM81', name: 'Cinetix Landmark 81', address: '720A Điện Biên Phủ, Bình Thạnh', city: 'TP. Hồ Chí Minh', status: 'Hoạt động' },
        { id: 'CMQ7', name: 'Cinetix Crescent Mall', address: '101 Tôn Dật Tiên, Quận 7', city: 'TP. Hồ Chí Minh', status: 'Hoạt động' },
        { id: 'BT1', name: 'Cinetix Bến Tre 1', address: '109 Hùng Vương, Phường 3', city: 'Bến Tre', status: 'Hoạt động' },
        { id: 'HN1', name: 'Cinetix Hà Nội 1', address: '100 Hồ Con Rùa, Quận Hoàn Kiếm', city: 'Hà Nội', status: 'Hoạt động' },
        { id: 'TV1', name: 'Cinetix Trà Vinh 1', address: '106 Nguyễn Thị Minh Khai, Phường 1', city: 'Trà Vinh', status: 'Hoạt động' }
    ];

    let roomsList = [
        { id: 1, name: 'Phòng 01 (Room 1)', cinema: 'Cinetix Hà Nội 1', seats: 78, status: 'Phòng trống' },
        { id: 2, name: 'Phòng 02 (Room 2)', cinema: 'Cinetix Crescent Mall', seats: 78, status: 'Đang sử dụng' },
        { id: 3, name: 'Phòng 03 (Room 3)', cinema: 'Cinetix Landmark 81', seats: 78, status: 'Đang sử dụng' },
        { id: 4, name: 'Phòng 04 (Room 4)', cinema: 'Cinetix Bến Tre 1', seats: 78, status: 'Đang sử dụng' }
    ];

    // DANH SÁCH NHÂN SỰ (HÌNH 5.13)
    let staffList = [
        { id: 'A111111', name: 'Daniel', email: 'daniel@example.com', phone: '0321654987', role: 'admin', status: 'Hoạt động' },
        { id: 'A123456', name: 'Alice (Nguyễn Hoàng)', email: 'alice@example.com', phone: '0123456789', role: 'admin', status: 'Hoạt động' },
        { id: 'A222222', name: 'Elisa', email: 'elisa@example.com', phone: '0399998888', role: 'admin', status: 'Không hoạt động' },
        { id: 'A321654', name: 'Bob', email: 'bob@example.com', phone: '0987654321', role: 'admin', status: 'Hoạt động' },
        { id: 'E147852', name: 'Helen', email: 'helen@example.com', phone: '0901234567', role: 'employee', status: 'Hoạt động' }
    ];

    // TRẠNG THÁI TÀI KHOẢN KHÁCH HÀNG: BẮT ĐẦU CHƯA AI ĐĂNG KÝ / ĐĂNG NHẬP
    let currentUser = null;
    let registeredUsers = [];

    // TRẠNG THÁI ĐẶT VÉ: TẤT CẢ = 0
    const state = {
        movie: 'Dưới bầu trời sao',
        cinema: 'Cinetix Landmark 81',
        room: 'Phòng 03',
        date: 'Thứ Bảy, 31/10/2026',
        time: '19:30',
        selectedSeats: [], // [{code, type, price}]
        foodQtys: { combo1: 0, popcornOnly: 0, coca: 0, milo: 0 },
        foodOptions: { combo1: 'Caramel', popcornOnly: 'Caramel', coca: 'Coca Cola', milo: 'Milo' },
        foodPrices: { combo1: 69000, popcornOnly: 45000, coca: 40000, milo: 25000 },
        foodNames: { combo1: 'Combo Một mình vui', popcornOnly: 'Bắp giòn', coca: 'Coca/Fanta', milo: 'Milo/Sprite' },
        payMethod: 'Ví MoMo / QR Cinetix'
    };

    // THỐNG KÊ HỆ THỐNG: KHỞI TẠO = 0
    const stats = {
        totalRevenue: 0,
        totalTickets: 0,
        newMembers: 0,
        movieTickets: {},
        movieRevenue: {},
        soldSeatsByShowtime: {},
        bookings: []
    };

    moviesCatalog.forEach(m => {
        stats.movieTickets[m.title] = 0;
        stats.movieRevenue[m.title] = 0;
    });

    function persistDemoState() { /* Business data is server-owned and is never stored in browser storage. */ }

    function restoreDemoState() { /* Keep any legacy browser data untouched; do not import it automatically. */ }

    function createPasswordSalt() {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
    }

    async function hashPassword(password, salt) {
        const bytes = new TextEncoder().encode(`${salt}:${password}`);
        const digest = await window.crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
    }

    async function createPasswordRecord(password) {
        const passwordSalt = createPasswordSalt();
        return { passwordSalt, passwordHash: await hashPassword(password, passwordSalt) };
    }

    async function verifyPassword(user, password) {
        if (user.passwordSalt && user.passwordHash) {
            return (await hashPassword(password, user.passwordSalt)) === user.passwordHash;
        }
        // Hỗ trợ nâng cấp dữ liệu demo cũ nếu người dùng đăng nhập lại.
        if (user.password === password) {
            const credential = await createPasswordRecord(password);
            Object.assign(user, credential);
            delete user.password;
            return true;
        }
        return false;
    }

    restoreDemoState();

    function formatVND(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    }

    function getInitials(fullName) {
        if (!fullName) return 'U';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    // Vẽ danh sách 8 phim trên Trang chủ & Thư viện Admin
    function renderMoviesCatalog() {
        const homeGrid = document.getElementById('homeMovieGrid');
        homeGrid.innerHTML = moviesCatalog.map(m => `
            <div class="movie-card">
                <div class="poster-wrap" onclick="selectMovieAndGo('${m.title}')">
                    <span class="age-badge">${m.rating}</span>
                    <img src="${m.poster}" alt="${m.title}">
                </div>
                <h3 style="font-size:0.96rem; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${m.title}</h3>
                <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">${m.genre} • ${m.duration}</p>
                <button class="btn-pink" style="width:100%;" onclick="selectMovieAndGo('${m.title}')">Đặt vé</button>
            </div>
        `).join('');

        const adminLib = document.getElementById('adminMovieLibList');
        document.getElementById('adminMovieTotalLabel').innerText = `${moviesCatalog.length} phim`;
        adminLib.innerHTML = moviesCatalog.map((m, idx) => `
            <div class="movie-lib-item ${idx === 0 ? 'active' : ''}" onclick="loadMovieToEdit(this, '${m.code}')">
                <img src="${m.poster}" alt="">
                <div>
                    <strong style="font-size: 0.92rem; display: block; margin-bottom: 2px;">${m.title}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-gray); display: block;">${m.genre} • ${m.duration} • ${m.rating}</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Khởi chiếu ${m.release} • Đang chiếu</span>
                </div>
                <button class="btn-dark btn-sm" style="color:var(--red);" onclick="event.stopPropagation(); deleteMovieByAdmin('${m.code}')">🗑️</button>
            </div>
        `).join('');
    }

    function syncAuthUI() {
        const btnNavAuth = document.getElementById('btnNavAuth');
        const userProfilePill = document.getElementById('userProfilePill');
        const checkoutHint = document.getElementById('checkoutAuthHint');

        if (!currentUser) {
            btnNavAuth.classList.remove('hidden');
            userProfilePill.classList.add('hidden');
            if (checkoutHint) checkoutHint.classList.remove('hidden');

            document.getElementById('checkoutName').value = '';
            document.getElementById('checkoutPhone').value = '';
            document.getElementById('checkoutEmail').value = '';

            document.getElementById('profGreetingName').innerText = 'Bạn';
            document.getElementById('profAvatarCircle').innerText = '--';
            document.getElementById('profCardName').innerText = 'Chưa đăng nhập';
            document.getElementById('profNameInput').value = '';
            document.getElementById('profEmailInput').value = '';
            document.getElementById('profPhoneInput').value = '';
            document.getElementById('profDobInput').value = '';
        } else {
            btnNavAuth.classList.add('hidden');
            userProfilePill.classList.remove('hidden');
            if (checkoutHint) checkoutHint.classList.add('hidden');

            const shortName = currentUser.name.trim().split(/\s+/).slice(-2).join(' ');
            const initials = getInitials(currentUser.name);

            document.getElementById('navAvatarDot').innerText = initials;
            document.getElementById('navUserName').innerText = shortName;

            document.getElementById('checkoutName').value = currentUser.name;
            document.getElementById('checkoutPhone').value = currentUser.phone;
            document.getElementById('checkoutEmail').value = currentUser.email;

            document.getElementById('profGreetingName').innerText = shortName;
            document.getElementById('profAvatarCircle').innerText = initials;
            document.getElementById('profCardName').innerText = currentUser.name;
            document.getElementById('profNameInput').value = currentUser.name;
            document.getElementById('profEmailInput').value = currentUser.email;
            document.getElementById('profPhoneInput').value = currentUser.phone;
            document.getElementById('profDobInput').value = currentUser.dob || '';
        }
    }

    async function handleRegister() {
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPass = document.getElementById('regPasswordConfirm').value;

        if (!name || !email || !phone || !password) {
            alert('Vui lòng điền đầy đủ Họ tên, Email, Số điện thoại và Mật khẩu!');
            return;
        }
        if (password.length < 6) {
            alert('Mật khẩu cần có ít nhất 6 ký tự!');
            return;
        }
        if (password !== confirmPass) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            alert('Email này đã được đăng ký! Vui lòng đăng nhập ở khung bên trái.');
            return;
        }

        const credential = await createPasswordRecord(password);
        const newUser = {
            id: 'U' + String(100000 + registeredUsers.length + 1),
            name, email, phone, ...credential, dob: '', status: 'Hoạt động'
        };
        registeredUsers.push(newUser);
        currentUser = newUser;
        stats.newMembers = registeredUsers.length;

        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPhone').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regPasswordConfirm').value = '';

        syncAuthUI();
        refreshAllStatsUI();
        alert(`Đăng ký thành công! Chào mừng ${name} đến với Cinetix.`);
        goScreen('profile');
    }

    async function handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ Email và Mật khẩu!');
            return;
        }
        if (registeredUsers.length === 0) {
            alert('Hệ thống hiện chưa có tài khoản nào được đăng ký! Vui lòng tạo tài khoản ở khung bên phải trước.');
            return;
        }
        const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!found || !(await verifyPassword(found, password))) {
            alert('Email hoặc Mật khẩu không chính xác!');
            return;
        }

        currentUser = found;
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';

        syncAuthUI();
        alert(`Đăng nhập thành công! Chào mừng ${found.name} trở lại.`);
        goScreen('profile');
    }

    function handleLogout() {
        currentUser = null;
        syncAuthUI();
        alert('Bạn đã đăng xuất khỏi hệ thống.');
        goScreen('auth');
    }

    function saveUserProfile() {
        if (!currentUser) return;
        const newName = document.getElementById('profNameInput').value.trim();
        const newEmail = document.getElementById('profEmailInput').value.trim();
        const newPhone = document.getElementById('profPhoneInput').value.trim();
        const newDob = document.getElementById('profDobInput').value.trim();

        if (!newName || !newEmail) {
            alert('Họ tên và Email không được để trống!');
            return;
        }
        currentUser.name = newName;
        currentUser.email = newEmail;
        currentUser.phone = newPhone;
        currentUser.dob = newDob;
        syncAuthUI();
        refreshAllStatsUI();
        alert('Đã lưu cập nhật hồ sơ cá nhân!');
    }

    function getShowtimeKey() {
        return `${state.movie}_${state.cinema}_${state.time}`;
    }

    function selectMovieAndGo(movieTitle, openTrailer = false) {
        changeMovieSelection(movieTitle);
        goScreen('showtimes');
        const tBox = document.getElementById('trailerBox');
        if (openTrailer) tBox.classList.remove('hidden');
        else tBox.classList.add('hidden');
    }

    function toggleTrailerBox() {
        document.getElementById('trailerBox').classList.toggle('hidden');
    }

    function changeMovieSelection(movieTitle) {
        state.movie = movieTitle;
        state.selectedSeats = [];
        const mObj = moviesCatalog.find(m => m.title === movieTitle) || moviesCatalog[0];

        document.querySelectorAll('.sumMovieTitle').forEach(el => el.innerText = mObj.title);
        document.querySelectorAll('.sumMoviePoster').forEach(el => el.src = mObj.poster);
        document.getElementById('detailAgeBadge').innerText = mObj.rating;
        document.getElementById('detailMetaLine').innerText = `${mObj.genre} • ${mObj.duration}`;
        document.getElementById('detailReleaseLine').innerText = `Khởi chiếu: ${mObj.release}`;
        document.getElementById('detailDescText').innerText = mObj.desc;
        document.getElementById('detailDirector').innerText = mObj.director;
        document.getElementById('detailActor').innerText = mObj.actor;

        renderSeatMap();
        syncSummaryUI();
    }

    // Vẽ sơ đồ ghế kết hợp: Hàng A,B,C (Thường - 95K), Hàng D,E,F (VIP - 115K), Hàng G (Ghế đôi G01-G06 - 190K)
    function renderSeatMap() {
        const container = document.getElementById('seatGridContainer');
        container.innerHTML = '';
        const soldList = stats.soldSeatsByShowtime[getShowtimeKey()] || [];

        const stdRows = ['A', 'B', 'C', 'D', 'E', 'F'];
        stdRows.forEach(r => {
            const rowEl = document.createElement('div');
            rowEl.className = 'seat-row';
            const isVipRow = ['D', 'E', 'F'].includes(r);

            const leftLbl = document.createElement('span');
            leftLbl.className = 'row-label';
            leftLbl.innerText = r;
            rowEl.appendChild(leftLbl);

            for (let c = 1; c <= 12; c++) {
                const colStr = c < 10 ? '0' + c : '' + c;
                const code = r + colStr;
                const isSold = soldList.includes(code);
                const isSelected = state.selectedSeats.some(s => s.code === code);
                const price = isVipRow ? 115000 : 95000;
                const typeLabel = isVipRow ? 'Ghế VIP' : 'Ghế thường';

                const btn = document.createElement('button');
                btn.className = `seat-cell ${isVipRow ? 'vip' : ''} ${isSold ? 'sold' : ''} ${isSelected ? 'selected' : ''}`;
                btn.innerText = isSold ? '×' : colStr;
                btn.disabled = isSold;
                btn.onclick = () => toggleSeat(code, typeLabel, price);
                rowEl.appendChild(btn);
            }

            const rightLbl = document.createElement('span');
            rightLbl.className = 'row-label';
            rightLbl.innerText = r;
            rowEl.appendChild(rightLbl);
            container.appendChild(rowEl);
        });

        // Hàng G: 6 ghế đôi (Couple Seats)
        const coupleRow = document.createElement('div');
        coupleRow.className = 'seat-row';
        const lG = document.createElement('span');
        lG.className = 'row-label';
        lG.innerText = 'G';
        coupleRow.appendChild(lG);

        for (let g = 1; g <= 6; g++) {
            const code = 'G0' + g;
            const isSold = soldList.includes(code);
            const isSelected = state.selectedSeats.some(s => s.code === code);

            const btn = document.createElement('button');
            btn.className = `seat-cell couple ${isSold ? 'sold' : ''} ${isSelected ? 'selected' : ''}`;
            btn.innerText = isSold ? '×' : `Đôi ${code}`;
            btn.disabled = isSold;
            btn.onclick = () => toggleSeat(code, 'Ghế đôi', 190000);
            coupleRow.appendChild(btn);
        }

        const rG = document.createElement('span');
        rG.className = 'row-label';
        rG.innerText = 'G';
        coupleRow.appendChild(rG);
        container.appendChild(coupleRow);
    }

    function toggleSeat(code, type, price) {
        const idx = state.selectedSeats.findIndex(s => s.code === code);
        if (idx > -1) {
            state.selectedSeats.splice(idx, 1);
        } else {
            state.selectedSeats.push({ code, type, price });
        }
        renderSeatMap();
        syncSummaryUI();
    }

    function proceedFromSeats() {
        if (state.selectedSeats.length === 0) {
            alert('Vui lòng click chọn ít nhất 1 ghế trên sơ đồ trước khi tiếp tục!');
            return;
        }
        goScreen('popcorn');
    }

    function selectDate(el, label) {
        document.querySelectorAll('#dateStrip .date-box').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        state.date = label;
        syncSummaryUI();
    }

    function pickShowtime(btn, cinema, time, room) {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.cinema = cinema;
        state.time = time;
        state.room = room || 'Phòng 03';
        state.selectedSeats = [];
        renderSeatMap();
        syncSummaryUI();
    }

    function pickSingleOpt(btn) {
        btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const card = btn.closest('.food-item-card');
        if (card) {
            const key = card.id.replace('foodCard_', '');
            state.foodOptions[key] = btn.textContent.replace(/^✓\s*/, '').trim();
            persistDemoState();
        }
    }

    function filterPopcornCat(pillEl, cat) {
        document.querySelectorAll('#popcornFilterPills .pill').forEach(p => p.classList.remove('active'));
        pillEl.classList.add('active');
        document.querySelectorAll('.food-item-card').forEach(card => {
            card.classList.toggle('hidden', cat !== 'all' && card.dataset.cat !== cat);
        });
    }

    function updateFoodItem(key, delta) {
        state.foodQtys[key] = Math.max(0, state.foodQtys[key] + delta);
        document.getElementById('qty_' + key).innerText = state.foodQtys[key];
        document.getElementById('foodCard_' + key).classList.toggle('active-combo', state.foodQtys[key] > 0);
        syncSummaryUI();
    }

    function selectPayMethod(el, methodTitle) {
        document.querySelectorAll('.pay-method-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
        state.payMethod = methodTitle;
    }

    function syncSummaryUI() {
        const hasSeats = state.selectedSeats.length > 0;
        const seatStr = hasSeats ? state.selectedSeats.map(s => s.code).join(', ') : 'Chưa chọn';
        const ticketMoney = state.selectedSeats.reduce((sum, s) => sum + s.price, 0);

        let comboMoney = 0;
        let comboParts = [];
        Object.keys(state.foodQtys).forEach(k => {
            const q = state.foodQtys[k];
            if (q > 0) {
                comboMoney += q * state.foodPrices[k];
                comboParts.push(`${q}x ${state.foodNames[k]} (${state.foodOptions[k] || 'Mặc định'})`);
            }
        });

        const total = ticketMoney + comboMoney;

        document.getElementById('chosenShowtimeBar').innerText = `${state.cinema} • ${state.date} • ${state.time}`;
        document.querySelectorAll('.sumRoomName').forEach(el => el.innerText = state.room);

        document.getElementById('seatBannerText').innerText = hasSeats
            ? `✓ Bạn đã chọn ghế: ${seatStr}`
            : 'Bạn chưa chọn ghế nào';
        document.getElementById('seatBannerPrice').innerText = formatVND(ticketMoney);

        document.querySelectorAll('.sumCinemaName').forEach(el => el.innerText = state.cinema);
        document.querySelectorAll('.sumDateTime').forEach(el => el.innerText = `${state.date} • ${state.time}`);
        document.querySelectorAll('.sumSeatBadge').forEach(el => el.innerText = hasSeats ? `Ghế ${seatStr}` : 'Chưa chọn ghế');
        document.querySelectorAll('.sumSeatShort').forEach(el => el.innerText = seatStr);
        document.querySelectorAll('.sumTicketCount').forEach(el => el.innerText = `${state.selectedSeats.length} vé đã chọn`);
        document.querySelectorAll('.sumTicketMoney').forEach(el => el.innerText = formatVND(ticketMoney));

        const comboLabel = comboParts.length > 0 ? comboParts.join(' + ') : 'Không chọn bắp nước';
        document.querySelectorAll('.sumComboLabel').forEach(el => el.innerText = comboLabel);
        document.querySelectorAll('.sumComboMoney').forEach(el => el.innerText = formatVND(comboMoney));
        document.querySelectorAll('.sumGrandTotal').forEach(el => el.innerText = formatVND(total));
    }

    // Bật Modal Quét Mã QR (Hình 5.7)
    function openQrPaymentModal() {
        if (state.selectedSeats.length === 0) {
            alert('Bạn chưa chọn ghế nào! Vui lòng chọn ghế trước.');
            goScreen('seats');
            return;
        }
        const custName = document.getElementById('checkoutName').value.trim();
        const custPhone = document.getElementById('checkoutPhone').value.trim();
        const custEmail = document.getElementById('checkoutEmail').value.trim();

        if (!custName || !custPhone || !custEmail) {
            alert('Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Email người đặt vé (hoặc Đăng nhập tài khoản)!');
            return;
        }

        if (!document.getElementById('checkoutTerms').checked) {
            alert('Vui lòng đồng ý với điều khoản sử dụng trước khi tiếp tục.');
            return;
        }

        document.getElementById('qrPaymentModal').classList.remove('hidden');
    }

    function closeQrPaymentModal() {
        document.getElementById('qrPaymentModal').classList.add('hidden');
    }

    // Hoàn tất Đặt vé & Cập nhật toàn bộ Thống kê Admin
    function completeBooking() {
        closeQrPaymentModal();

        const custName = document.getElementById('checkoutName').value.trim();
        const seatCount = state.selectedSeats.length;
        const seatStr = state.selectedSeats.map(s => s.code).join(', ');
        const ticketMoney = state.selectedSeats.reduce((sum, s) => sum + s.price, 0);

        let comboMoney = 0;
        let comboParts = [];
        Object.keys(state.foodQtys).forEach(k => {
            const q = state.foodQtys[k];
            if (q > 0) {
                comboMoney += q * state.foodPrices[k];
                comboParts.push(`${q}x ${state.foodNames[k]} (${state.foodOptions[k] || 'Mặc định'})`);
            }
        });

        const totalOrderMoney = ticketMoney + comboMoney;
        const comboDesc = comboParts.length > 0 ? comboParts.join(' + ') : 'Không kèm bắp nước';

        const key = getShowtimeKey();
        if (!stats.soldSeatsByShowtime[key]) stats.soldSeatsByShowtime[key] = [];
        stats.soldSeatsByShowtime[key].push(...state.selectedSeats.map(s => s.code));

        stats.totalRevenue += totalOrderMoney;
        stats.totalTickets += seatCount;
        stats.movieTickets[state.movie] = (stats.movieTickets[state.movie] || 0) + seatCount;
        stats.movieRevenue[state.movie] = (stats.movieRevenue[state.movie] || 0) + totalOrderMoney;

        const dateParts = state.date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        const orderDate = dateParts ? `${dateParts[3].slice(-2)}${dateParts[2]}${dateParts[1]}` : '261031';
        const orderCode = `CTX-${orderDate}-${String(1000 + stats.bookings.length + 1).slice(-4)}`;
        const mObj = moviesCatalog.find(m => m.title === state.movie) || moviesCatalog[0];

        const newOrder = {
            code: orderCode,
            customer: custName,
            customerEmail: document.getElementById('checkoutEmail').value.trim(),
            userId: currentUser ? currentUser.id : null,
            movie: state.movie,
            poster: mObj.poster,
            cinema: state.cinema,
            room: state.room,
            date: state.date,
            time: state.time,
            seats: seatStr,
            seatCount: seatCount,
            comboText: comboDesc,
            payMethod: state.payMethod,
            total: totalOrderMoney
        };
        stats.bookings.unshift(newOrder);

        // Hiển thị lên Thẻ Vé Điện Tử (Step 5)
        document.getElementById('ticketHolderShort').innerText = custName.split(' ').slice(-2).join(' ');
        document.getElementById('finalTicketCode').innerText = 'VÉ ĐIỆN TỬ / ' + orderCode;
        document.getElementById('finalMovieTitle').innerText = newOrder.movie;
        document.getElementById('finalCinema').innerText = newOrder.cinema;
        document.getElementById('finalDate').innerText = dateParts ? dateParts[0] : state.date;
        document.getElementById('finalTime').innerText = newOrder.time;
        document.getElementById('finalRoom').innerText = newOrder.room;
        document.getElementById('finalSeats').innerText = newOrder.seats;
        document.getElementById('finalCustName').innerText = newOrder.customer;
        document.getElementById('finalTicketCount').innerText = `${newOrder.seatCount} vé`;
        document.getElementById('finalComboText').innerText = newOrder.comboText;
        document.getElementById('finalPayMethodText').innerText = `Mô phỏng: ${newOrder.payMethod}`;
        document.getElementById('finalTotalMoney').innerText = formatVND(newOrder.total);
        document.getElementById('finalTicketQrImg').src = '/public/cinetix-logo.svg';

        // Reset lựa chọn tạm thời
        state.selectedSeats = [];
        Object.keys(state.foodQtys).forEach(k => {
            state.foodQtys[k] = 0;
            document.getElementById('qty_' + k).innerText = '0';
            document.getElementById('foodCard_' + k).classList.remove('active-combo');
        });

        renderSeatMap();
        syncSummaryUI();
        refreshAllStatsUI();
        goScreen('complete');
    }

    // Đồng bộ toàn bộ 6 Tab Quản trị & Hồ sơ cá nhân
    function refreshAllStatsUI() {
        // 1. Hồ sơ cá nhân
        const memberBookings = currentUser ? stats.bookings.filter(b =>
            b.userId === currentUser.id || (b.customerEmail && b.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
        ) : [];
        document.getElementById('profTotalTickets').innerText = memberBookings.reduce((sum, booking) => sum + (booking.seatCount || 0), 0);
        document.getElementById('profUpcomingTickets').innerText = memberBookings.reduce((sum, booking) => sum + (booking.seatCount || 0), 0);
        document.getElementById('profTotalSpent').innerText = formatVND(memberBookings.reduce((sum, booking) => sum + (booking.total || 0), 0));

        const historyContainer = document.getElementById('profileHistoryList');
        if (memberBookings.length === 0) {
            historyContainer.innerHTML = `<div class="empty-state-box">Chưa có vé nào được đặt. Hãy chọn phim và đặt vé để xem lịch sử tại đây!</div>`;
        } else {
            historyContainer.innerHTML = memberBookings.map(b => `
                <div class="history-card-featured">
                    <div class="history-card-top">
                        <span>${b.code} • ${b.payMethod}</span>
                        <span class="badge-outline">ĐÃ XÁC NHẬN (DEMO)</span>
                    </div>
                    <div class="history-card-body">
                        <img src="${b.poster}" alt="${b.movie}">
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 6px;">${b.movie}</h3>
                            <p style="font-size: 0.86rem; color: var(--text-white); margin-bottom: 4px;">${b.cinema} • ${b.date} • ${b.time}</p>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">${b.room} • Ghế ${b.seats} (${b.seatCount} vé)</p>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">${b.comboText}</p>
                            <strong style="font-size: 1.15rem; color: var(--pink-light);">${formatVND(b.total)}</strong>
                        </div>
                        <div><button class="btn-dark" onclick="goScreen('complete')">Xem vé QR</button></div>
                    </div>
                </div>
            `).join('');
        }

        // 2. Admin KPI & Biểu đồ
        document.getElementById('kpiRevenue').innerText = formatVND(stats.totalRevenue);
        document.getElementById('kpiTickets').innerText = stats.totalTickets;
        const occupancyPct = ((stats.totalTickets / 312) * 100).toFixed(1).replace('.', ',');
        document.getElementById('kpiOccupancy').innerText = stats.totalTickets === 0 ? '0%' : `${occupancyPct}%`;
        document.getElementById('kpiMembers').innerText = stats.newMembers;

        document.getElementById('kpiRevenueTrend').innerText = stats.totalRevenue > 0 ? `+${formatVND(stats.totalRevenue)} hôm nay` : '0% so với tuần trước';
        document.getElementById('kpiRevenueTrend').className = stats.totalRevenue > 0 ? 'kpi-trend positive' : 'kpi-trend';
        document.getElementById('kpiTicketsTrend').innerText = `+${stats.totalTickets} vé mới`;
        document.getElementById('kpiOccupancyTrend').innerText = `${stats.totalTickets} / 312 ghế mở bán`;
        document.getElementById('kpiMembersTrend').innerText = `+${stats.newMembers} thành viên`;

        const barPct = stats.totalRevenue === 0 ? 2 : Math.min(100, Math.max(12, Math.round((stats.totalRevenue / 1000000) * 100)));
        document.getElementById('todayRevenueBar').style.height = barPct + '%';

        // Phim dẫn đầu (Top 4)
        const maxTicketRef = Math.max(1, stats.totalTickets);
        const topListEl = document.getElementById('topMoviesProgressList');
        topListEl.innerHTML = moviesCatalog.slice(0, 5).map(m => {
            const c = stats.movieTickets[m.title] || 0;
            const pct = stats.totalTickets === 0 ? 0 : Math.round((c / maxTicketRef) * 100);
            return `
                <div class="top-movie-item">
                    <div class="top-movie-head"><strong>${m.title}</strong><span style="color:var(--text-muted);">${c} vé</span></div>
                    <div class="progress-track"><div class="progress-bar" style="width: ${pct}%;"></div></div>
                </div>
            `;
        }).join('');

        // Bảng Vé đặt gần đây (Tab Tổng quan)
        const recentBody = document.getElementById('adminRecentBookingsBody');
        if (stats.bookings.length === 0) {
            recentBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:26px; color:var(--text-muted);">Chưa có đơn đặt vé nào (Doanh số = 0đ).</td></tr>`;
        } else {
            recentBody.innerHTML = stats.bookings.map(b => `
                <tr>
                    <td style="color:white; font-weight:600;">${b.code}</td>
                    <td>${b.customer}</td>
                    <td>${b.movie}</td>
                    <td>${b.seats}</td>
                    <td>${formatVND(b.total)}</td>
                    <td style="color: var(--amber); font-weight: 600;">Đã xác nhận (demo)</td>
                </tr>
            `).join('');
        }

        // Cập nhật sức chứa từng khung giờ
        ['14:00', '16:45', '19:30', '21:00'].forEach(slot => {
            let countInSlot = 0;
            Object.keys(stats.soldSeatsByShowtime).forEach(k => {
                if (k.endsWith('_' + slot)) countInSlot += stats.soldSeatsByShowtime[k].length;
            });
            const el = document.getElementById(`slotCap_${slot}`);
            if (el) el.innerText = `${countInSlot} / 78 ghế`;
        });

        // 3. Bảng Rạp & Phòng chiếu (Tab 3 - Hình 5.16)
        document.getElementById('adminCinemasBody').innerHTML = cinemasList.map((c, idx) => `
            <tr>
                <td style="color:white; font-weight:700;">${c.id}</td>
                <td style="color:white;">${c.name}</td>
                <td>${c.address}</td>
                <td>${c.city}</td>
                <td style="color:var(--green);">${c.status}</td>
                <td>
                    <button class="btn-dark btn-sm" onclick="deleteCinemaItem(${idx})">🗑️ Xóa</button>
                </td>
            </tr>
        `).join('');

        document.getElementById('adminRoomsBody').innerHTML = roomsList.map((r, idx) => `
            <tr>
                <td style="color:white; font-weight:700;">${r.id}</td>
                <td style="color:white;">${r.name}</td>
                <td>${r.cinema}</td>
                <td>${r.seats} ghế</td>
                <td style="color:${r.status === 'Đang sử dụng' ? 'var(--green)' : 'var(--amber)'};">${r.status}</td>
                <td>
                    <button class="btn-dark btn-sm" onclick="deleteRoomItem(${idx})">🗑️ Xóa</button>
                </td>
            </tr>
        `).join('');

        // 4. Bảng Tài khoản người dùng (Tab 4 - Hình 5.12)
        const usersBody = document.getElementById('adminUsersBody');
        if (registeredUsers.length === 0) {
            usersBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:26px; color:var(--text-muted);">Chưa có tài khoản khách hàng nào đăng ký (0 thành viên).</td></tr>`;
        } else {
            usersBody.innerHTML = registeredUsers.map((u, idx) => `
                <tr>
                    <td>${idx + 1}</td>
                    <td style="color:white; font-weight:600;">${u.id}</td>
                    <td style="color:white;">${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.phone}</td>
                    <td>user</td>
                    <td style="color:var(--green);">${u.status}</td>
                    <td><button class="btn-dark btn-sm" style="color:var(--red);" onclick="deleteUserByAdmin(${idx})">🗑️ Xóa</button></td>
                </tr>
            `).join('');
        }

        // 5. Bảng Tài khoản nhân sự (Tab 5 - Hình 5.13)
        document.getElementById('adminStaffBody').innerHTML = staffList.map((s, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td style="color:white; font-weight:600;">${s.id}</td>
                <td style="color:white;">${s.name}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                <td><span class="badge-outline">${s.role}</span></td>
                <td style="color:${s.status === 'Hoạt động' ? 'var(--green)' : 'var(--text-muted)'};">${s.status}</td>
                <td><button class="btn-dark btn-sm" style="color:var(--red);" onclick="deleteStaffByAdmin(${idx})">🗑️ Xóa</button></td>
            </tr>
        `).join('');

        // 6. Bảng Doanh thu theo phim & Toàn bộ vé (Tab 6 - Hình 5.11)
        document.getElementById('adminMovieRevenueTableBody').innerHTML = moviesCatalog.map(m => {
            const vCount = stats.movieTickets[m.title] || 0;
            const vRev = stats.movieRevenue[m.title] || 0;
            return `
                <tr>
                    <td style="color:white; font-weight:600;">${m.title}</td>
                    <td>${m.genre}</td>
                    <td>${vCount}</td>
                    <td style="color:var(--pink-light); font-weight:700;">${formatVND(vRev)}</td>
                </tr>
            `;
        }).join('');

        const allBookingsBody = document.getElementById('adminAllBookingsBody');
        if (stats.bookings.length === 0) {
            allBookingsBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:26px; color:var(--text-muted);">Chưa có vé nào được phát hành.</td></tr>`;
        } else {
            allBookingsBody.innerHTML = stats.bookings.map(b => `
                <tr>
                    <td style="color:white; font-weight:700;">${b.code}</td>
                    <td>${b.customer}</td>
                    <td>${b.movie}</td>
                    <td>${b.cinema} (${b.room})</td>
                    <td>${b.time} - ${b.date}</td>
                    <td>${b.seats}</td>
                    <td>${b.comboText}</td>
                    <td style="color:var(--green); font-weight:700;">${formatVND(b.total)}</td>
                </tr>
            `).join('');
        }
    }

    // Các thao tác Quản trị viên (Thêm/Sửa/Xóa Phim, Rạp, Phòng, Người dùng, Nhân sự)
    function loadMovieToEdit(itemEl, code) {
        document.querySelectorAll('.movie-lib-item').forEach(i => i.classList.remove('active'));
        itemEl.classList.add('active');
        const m = moviesCatalog.find(x => x.code === code);
        if (!m) return;
        document.getElementById('movieFormHeading').innerText = 'Chỉnh sửa phim';
        document.getElementById('editMovieCode').innerText = m.code;
        document.getElementById('editMovieTitle').value = m.title;
        document.getElementById('editMovieDuration').value = m.duration;
        document.getElementById('editMovieRating').value = m.rating;
        document.getElementById('editMovieGenre').value = m.genre;
        document.getElementById('editMovieRelease').value = m.release;
        document.getElementById('editMovieDesc').value = m.desc;
        document.getElementById('scheduleMovieTitle').innerText = m.title;
    }

    function prepareNewMovieForm() {
        const nextNum = moviesCatalog.length + 1;
        document.getElementById('movieFormHeading').innerText = 'Thêm phim mới';
        document.getElementById('editMovieCode').innerText = 'PH-00' + nextNum;
        document.getElementById('editMovieTitle').value = '';
        document.getElementById('editMovieDuration').value = '120 phút';
        document.getElementById('editMovieGenre').value = 'Hành động, Phiêu lưu';
        document.getElementById('editMovieRelease').value = '15/11/2026';
        document.getElementById('editMovieDesc').value = '';
    }

    function saveMovieFromAdmin() {
        const code = document.getElementById('editMovieCode').innerText;
        const title = document.getElementById('editMovieTitle').value.trim();
        if (!title) { alert('Vui lòng nhập tên phim!'); return; }

        const existing = moviesCatalog.find(m => m.code === code);
        if (existing) {
            existing.title = title;
            existing.duration = document.getElementById('editMovieDuration').value.trim();
            existing.rating = document.getElementById('editMovieRating').value;
            existing.genre = document.getElementById('editMovieGenre').value.trim();
            existing.release = document.getElementById('editMovieRelease').value.trim();
            existing.desc = document.getElementById('editMovieDesc').value.trim();
        } else {
            moviesCatalog.unshift({
                code,
                title,
                duration: document.getElementById('editMovieDuration').value.trim() || '120 phút',
                rating: document.getElementById('editMovieRating').value,
                genre: document.getElementById('editMovieGenre').value.trim() || 'Phim truyện',
                release: document.getElementById('editMovieRelease').value.trim() || '2026',
                director: 'Đạo diễn Cinetix',
                actor: 'Dàn diễn viên trẻ',
                desc: document.getElementById('editMovieDesc').value.trim() || 'Bộ phim mới cập nhật trên hệ thống Cinetix.',
                poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
            });
            stats.movieTickets[title] = 0;
            stats.movieRevenue[title] = 0;
        }
        renderMoviesCatalog();
        refreshAllStatsUI();
        alert(`Đã lưu phim "${title}" thành công!`);
    }

    function deleteMovieByAdmin(code) {
        if (moviesCatalog.length <= 1) return;
        moviesCatalog = moviesCatalog.filter(m => m.code !== code);
        renderMoviesCatalog();
        refreshAllStatsUI();
    }

    function addCinemaPrompt() {
        const name = prompt('Nhập tên rạp Cinetix mới (VD: Cinetix Đà Nẵng 1):');
        if (!name) return;
        const city = prompt('Nhập Tỉnh / Thành phố:', 'Đà Nẵng') || 'Việt Nam';
        cinemasList.push({
            id: 'CN' + (cinemasList.length + 1),
            name,
            address: 'Trung tâm Thương mại Cinetix',
            city,
            status: 'Hoạt động'
        });
        refreshAllStatsUI();
    }

    function deleteCinemaItem(idx) {
        cinemasList.splice(idx, 1);
        refreshAllStatsUI();
    }

    function addRoomPrompt() {
        const name = prompt('Nhập tên phòng chiếu mới (VD: Phòng 05 IMAX):');
        if (!name) return;
        roomsList.push({
            id: roomsList.length + 1,
            name,
            cinema: 'Cinetix Landmark 81',
            seats: 78,
            status: 'Phòng trống'
        });
        refreshAllStatsUI();
    }

    function deleteRoomItem(idx) {
        roomsList.splice(idx, 1);
        refreshAllStatsUI();
    }

    async function addCustomerByAdmin() {
        const name = prompt('Nhập họ tên khách hàng mới:');
        if (!name) return;
        const email = prompt('Nhập email khách hàng:', 'khachhang@example.com') || 'user@example.com';
        registeredUsers.push({
            id: 'U' + String(100000 + registeredUsers.length + 1),
            name,
            email,
            phone: '0901234567',
            ...(await createPasswordRecord('123456')),
            status: 'Hoạt động'
        });
        stats.newMembers = registeredUsers.length;
        refreshAllStatsUI();
    }

    function deleteUserByAdmin(idx) {
        registeredUsers.splice(idx, 1);
        stats.newMembers = registeredUsers.length;
        refreshAllStatsUI();
    }

    function addStaffByAdmin() {
        const name = prompt('Nhập họ tên nhân sự mới:');
        if (!name) return;
        const role = prompt('Nhập vai trò (admin hoặc employee):', 'employee') || 'employee';
        staffList.push({
            id: (role === 'admin' ? 'A' : 'E') + Math.floor(100000 + Math.random() * 900000),
            name,
            email: name.toLowerCase().replace(/\s+/g, '') + '@cinetix.vn',
            phone: '0912345678',
            role,
            status: 'Hoạt động'
        });
        refreshAllStatsUI();
    }

    function deleteStaffByAdmin(idx) {
        staffList.splice(idx, 1);
        refreshAllStatsUI();
    }

    function selectAdminShowtimeRow(rowEl, time, price) {
        rowEl.parentElement.querySelectorAll('tr').forEach(r => r.classList.remove('active-row'));
        rowEl.classList.add('active-row');
        document.getElementById('editSlotHeading').innerText = time;
        document.getElementById('editSlotTimeInput').value = time;
        document.getElementById('editSlotPriceInput').value = price;
    }

    function resetAllSystemData() {
        if (!confirm('Đặt lại toàn bộ tài khoản, doanh số, vé đã đặt và sơ đồ ghế về 0?')) return;
        currentUser = null;
        registeredUsers = [];
        stats.totalRevenue = 0;
        stats.totalTickets = 0;
        stats.newMembers = 0;
        Object.keys(stats.movieTickets).forEach(k => {
            stats.movieTickets[k] = 0;
            stats.movieRevenue[k] = 0;
        });
        stats.soldSeatsByShowtime = {};
        stats.bookings = [];
        state.selectedSeats = [];
        Object.keys(state.foodQtys).forEach(k => state.foodQtys[k] = 0);
        syncAuthUI();
        renderSeatMap();
        syncSummaryUI();
        refreshAllStatsUI();
    }

    function switchAdminView(view) {
        const views = ['overview', 'movies', 'cinemas', 'users', 'staff', 'bookings'];
        const titles = {
            overview: 'Quản trị / Tổng quan (Dashboard)',
            movies: 'Quản trị / Phim & Suất chiếu',
            cinemas: 'Quản trị / Rạp & Phòng chiếu',
            users: 'Quản trị / Tài khoản người dùng',
            staff: 'Quản trị / Tài khoản nhân sự',
            bookings: 'Quản trị / Vé đã đặt & Doanh thu'
        };

        views.forEach(v => {
            document.getElementById('admin-view-' + v).classList.toggle('hidden', v !== view);
            document.getElementById('adm-nav-' + v).classList.toggle('active', v === view);
        });
        document.getElementById('adminBreadcrumb').innerText = titles[view] || 'Quản trị';
    }

    function goScreen(target) {
        if (target === 'profile' && !currentUser) {
            alert('Bạn chưa đăng nhập! Vui lòng Đăng nhập hoặc Tạo tài khoản mới để xem Hồ sơ cá nhân.');
            target = 'auth';
        }

        const clientScreens = ['home', 'showtimes', 'seats', 'popcorn', 'checkout', 'complete', 'profile', 'auth'];
        const isAdmin = target.startsWith('admin');

        document.getElementById('clientNavbar').classList.toggle('hidden', isAdmin);
        document.getElementById('clientFooter').classList.toggle('hidden', isAdmin);
        document.getElementById('adminWrapper').classList.toggle('hidden', !isAdmin);

        clientScreens.forEach(s => {
            document.getElementById(`screen-${s}`).classList.toggle('hidden', isAdmin || s !== target);
        });

        const stepScreens = ['seats', 'popcorn', 'checkout', 'complete'];
        document.getElementById('stepperBar').classList.toggle('hidden', isAdmin || !stepScreens.includes(target));

        const order = ['showtimes', 'seats', 'popcorn', 'checkout', 'complete'];
        const curIdx = order.indexOf(target);
        if (curIdx > 0) {
            for (let i = 1; i <= 5; i++) {
                const stEl = document.getElementById(`st-${i}`);
                const circle = stEl.querySelector('.step-circle');
                stEl.classList.remove('active', 'done');
                if (i - 1 < curIdx) {
                    stEl.classList.add('done');
                    circle.innerText = '✓';
                } else if (i - 1 === curIdx) {
                    stEl.classList.add('active');
                    circle.innerText = i;
                } else {
                    circle.innerText = i;
                }
            }
        }

        if (isAdmin) {
            const subView = target.replace('admin-', '');
            switchAdminView(['overview','movies','cinemas','users','staff','bookings'].includes(subView) ? subView : 'overview');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }


    const persistentActions = [
        'syncAuthUI', 'syncSummaryUI', 'refreshAllStatsUI', 'handleRegister', 'handleLogin',
        'handleLogout', 'saveUserProfile', 'changeMovieSelection', 'toggleSeat', 'selectDate',
        'pickShowtime', 'updateFoodItem', 'selectPayMethod', 'completeBooking',
        'saveMovieFromAdmin', 'deleteMovieByAdmin', 'addCinemaPrompt', 'deleteCinemaItem',
        'addRoomPrompt', 'deleteRoomItem', 'addCustomerByAdmin', 'deleteUserByAdmin',
        'addStaffByAdmin', 'deleteStaffByAdmin', 'resetAllSystemData'
    ];
    persistentActions.forEach(name => {
        const original = window[name];
        if (typeof original !== 'function') return;
        window[name] = function (...args) {
            const result = original.apply(this, args);
            if (result && typeof result.then === 'function') {
                return result.finally(persistDemoState);
            }
            persistDemoState();
            return result;
        };
    });

    // Khởi tạo toàn bộ hệ thống
    renderMoviesCatalog();
    syncAuthUI();
    renderSeatMap();
    syncSummaryUI();
    refreshAllStatsUI();
