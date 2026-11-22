# Cinetix — Đặt vé & Quản trị rạp phim

Website tiếng Việt dựa trên tệp HTML tham chiếu. Giao diện giữ HTML/CSS/JavaScript thuần; backend Node.js cung cấp API JSON, đăng nhập phiên server-side, phân quyền quản trị và MySQL Managed.

## Chạy 

Cấu hình dự án cần có `DATABASE_URL` (Managed MySQL) và hai secret ban đầu `CINETIX_ADMIN_EMAIL` / `CINETIX_ADMIN_PASSWORD`. Không ghi các giá trị này vào tệp, Git hoặc log. Tài khoản admin đầu tiên yêu cầu mật khẩu ít nhất 12 ký tự; nó chỉ được tạo khi migration không tìm thấy admin nào.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm migrate
corepack pnpm dev
```

`pnpm dev` chạy migration không phá hủy rồi mở server. `pnpm start` chỉ mở server trên `PORT` (mặc định `3000`) sau khi schema đã được chuẩn bị. Health endpoint là `/_app/health`. Container production dùng Node 22, dependency từ lockfile và chạy bằng user không đặc quyền; migrations được chạy trước lúc phát hành, không chặn health listener khi container khởi động.

## Dữ liệu và tài khoản

Thông tin tài khoản, phim, rạp, phòng, suất chiếu, bắp nước, booking, ghế và thống kê được đọc/ghi vào MySQL Managed qua API; không dùng `localStorage` làm nguồn nghiệp vụ. Dữ liệu cũ ở từng trình duyệt không tự được nhập vào DB. Preview và phiên bản công khai dùng chung DB nên thao tác ghi từ cả hai môi trường là dữ liệu thật của cùng website; không chạy reset hoặc xóa dữ liệu để thử nghiệm. Migration có số phiên bản/checksum; dữ liệu mẫu chỉ seed vào bảng đang trống.

Đăng ký khách dùng mật khẩu tối thiểu 6 ký tự; băm và xác minh bằng `crypto.scrypt` bất đồng bộ. Session lưu token hash trong DB; cookie phiên là `HttpOnly`, `Secure`, `SameSite=None` trên HTTPS. Các API quản trị tự kiểm tra role admin ở máy chủ. Admin đầu tiên dùng thông tin trong protected secrets của dự án.

Rate limits được lưu trong ba bucket cố định của MySQL, dùng chung giữa các instance và không lưu địa chỉ IP: tối đa 300 yêu cầu đăng nhập, 100 đăng ký và 100 tạo booking trong mỗi cửa sổ 15 phút. Preview và production dùng chung các bộ đếm này.

## Giới hạn bản demo

Phim, suất chiếu, giá và catalog khởi tạo là dữ liệu minh họa cần được quản trị viên rà lại trước khi vận hành thương mại. Đơn booking ghi trạng thái xác nhận demo để trình diễn vé và thống kê. QR, MoMo, ATM và thẻ chỉ mô phỏng: website không thu số thẻ, không gửi tiền và không phát hành vé thanh toán thật. Banner trên website thông báo rằng hồ sơ/liên hệ/đơn được lưu trong database dùng chung.
