# Cinetix — Hệ thống Đặt vé & Quản trị Rạp phim

Ứng dụng web đặt vé xem phim và quản trị cụm rạp bằng tiếng Việt. Giao diện xây dựng bằng HTML/CSS/JavaScript thuần; backend chạy trên Node.js (`>=22.0.0`) sử dụng thư viện `mysql2` cung cấp API JSON, xác thực phiên phía máy chủ (server-side session) và lưu trữ dữ liệu trên MySQL/MariaDB.

## Yêu cầu hệ thống

- **Node.js 22** (hỗ trợ sẵn cờ `--env-file` để đọc tệp `.env`)
- **MySQL / MariaDB** (dùng XAMPP khi chạy cục bộ, hoặc dịch vụ MySQL đám mây như TiDB Cloud / Aiven khi triển khai lên Render)

## Biến môi trường

Không đưa tệp `.env`, mật khẩu hoặc chuỗi kết nối lên Git hay log.

| Biến | Bắt buộc | Mô tả |
| :--- | :--- | :--- |
| `DATABASE_URL` | Có | Chuỗi kết nối dạng `mysql://USER:PASS@HOST:PORT/cinetix` |
| `CINETIX_ADMIN_EMAIL` | Khi khởi tạo DB mới | Email tài khoản quản trị đầu tiên (chỉ tạo khi chưa có admin nào) |
| `CINETIX_ADMIN_PASSWORD` | Khi khởi tạo DB mới | Mật khẩu admin đầu tiên (từ 12 đến 256 ký tự) |
| `CINETIX_COOKIE_MODE` | Chỉ khi chạy HTTP cục bộ | Đặt `local-http` khi chạy `localhost`; để trống trên HTTPS (Render) |
| `PORT` | Không | Cổng máy chủ HTTP (mặc định `3000`) |

## Chạy cục bộ với XAMPP

1. Mở **XAMPP Control Panel** và bật **MySQL** (tạo sẵn cơ sở dữ liệu tên `cinetix` trong phpMyAdmin).
2. Tạo tệp `.env` ở thư mục gốc dự án:

```env
DATABASE_URL=mysql://root@127.0.0.1:3306/cinetix
CINETIX_COOKIE_MODE=local-http
CINETIX_ADMIN_EMAIL=admin@cinetix.local
CINETIX_ADMIN_PASSWORD=MatKhauAdminTu12KyTu!
PORT=3000
```

3. Cài thư viện, khởi tạo bảng/dữ liệu mẫu và chạy máy chủ:

```bash
npm install
node --env-file=.env scripts/migrate.js
node --env-file=.env server.js
```

4. Truy cập `http://localhost:3000` (endpoint kiểm tra trạng thái: `/_app/health`).

## Triển khai trên Render

Render không cung cấp sẵn MySQL nên cần tạo cơ sở dữ liệu MySQL trên dịch vụ ngoài (ví dụ TiDB Cloud Serverless) trước, sau đó tạo **Web Service (Node)** trên Render với cấu hình:

- **Build Command:** `npm install`
- **Start Command:** `npm run dev` *(chạy migration không phá hủy rồi khởi động `server.js`)*
- **Health Check Path:** `/_app/health`
- **Environment Variables:** khai báo `DATABASE_URL`, `CINETIX_ADMIN_EMAIL`, `CINETIX_ADMIN_PASSWORD` *(không khai báo `CINETIX_COOKIE_MODE=local-http` vì Render chạy HTTPS)*.

Nếu chạy bằng Docker (`Dockerfile`), container dùng Node 22, cài dependency từ `pnpm-lock.yaml`, lắng nghe trên `PORT` (mặc định `3000`) và yêu cầu chạy `scripts/migrate.js` trước khi khởi động.

## Các lệnh hỗ trợ

```bash
npm run check     # Kiểm tra cú pháp toàn bộ tệp JS frontend & backend
npm run migrate   # Chạy migration và nạp dữ liệu mẫu vào các bảng trống
npm run dev       # Chạy migration rồi khởi động server
npm start         # Chỉ khởi động server (khi schema đã sẵn sàng)
```

## Kiến trúc dữ liệu & bảo mật

- **Lưu trữ tập trung trên MySQL:** Phim, rạp, phòng chiếu, suất chiếu, bắp nước, tài khoản, nhân sự, đơn vé và ghế đều được đọc/ghi qua API; không dùng `localStorage` làm nguồn dữ liệu nghiệp vụ.
- **Migration an toàn:** Các tệp SQL trong `db/migrations/` được đánh số và kiểm tra checksum SHA-256 trong bảng `schema_migrations`. Dữ liệu mẫu (`db/seed.js`) chỉ nạp khi bảng tương ứng còn trống.
- **Xác thực & phân quyền:** Mật khẩu băm bằng `crypto.scrypt` bất đồng bộ (tối thiểu 6 ký tự với khách hàng, 12 ký tự với admin khởi tạo). Phiên đăng nhập lưu dạng token hash trong bảng `sessions`, cấp cookie `HttpOnly` kèm kiểm tra CSRF (`X-Cinetix-CSRF`). Đổi mật khẩu qua `/api/auth/password` sẽ tự thu hồi toàn bộ phiên cũ. Mọi tuyến `/api/admin/*` đều kiểm tra quyền `admin` tại máy chủ.
- **Giới hạn tần suất (Rate limit):** Lưu tập trung trong bảng `request_rate_limits` theo 3 nhóm cố định mỗi cửa sổ 15 phút: `login` (300), `register` (100), `booking` (100).

## Phạm vi bản demo

Phim, lịch chiếu, giá vé và danh mục bắp nước khởi tạo là dữ liệu minh họa. Đơn đặt vé lưu trạng thái xác nhận demo (`demo_confirmed`); các phương thức QR, MoMo, ATM và thẻ quốc tế chỉ mô phỏng quy trình, không thu thông tin thẻ và không phát sinh giao dịch thanh toán thật.
