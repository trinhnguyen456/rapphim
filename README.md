# Cinetix — Đặt vé & Quản trị rạp phim

Bản mẫu website tiếng Việt chuyển thể từ HTML tham chiếu do người dùng cung cấp. Dự án dùng HTML, CSS và JavaScript thuần, không cài thư viện ứng dụng.

## Chạy

```bash
npm start
```

Máy chủ Node.js sử dụng `PORT` nếu được cung cấp, mặc định là `3000`.

## Giới hạn dữ liệu

Đây là bản demo phía trình duyệt. Tài khoản, phim, rạp, nhân sự, vé và thống kê được lưu trong `localStorage` của trình duyệt hiện tại; không đồng bộ với thiết bị/người dùng khác. Mật khẩu demo được lưu dưới dạng hash có salt, nhưng hệ thống không phải dịch vụ xác thực an toàn. Không nhập mật khẩu quan trọng hoặc thông tin thanh toán thật. QR, MoMo, ATM và thẻ chỉ là giao diện mô phỏng; không phát sinh thanh toán thật.
