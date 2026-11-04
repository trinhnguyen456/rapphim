# Kế hoạch triển khai — Cinetix

## Phạm vi sản phẩm

Dựng website tiếng Việt dựa trên tệp `!DOCTYPE1.html` do người dùng cung cấp. Giữ nhận diện Cinetix, nội dung mẫu, phong cách giao diện tối với điểm nhấn hồng và các luồng tương tác quan trọng:

- **Khách hàng:** trang phim đang chiếu/sắp chiếu, thông tin phim và trailer, lịch chiếu theo ngày/rạp, chọn ghế thường/VIP/ghế đôi, chọn bắp nước, thông tin người mua, chọn cách thanh toán mô phỏng, mã QR/vé điện tử, đăng ký/đăng nhập, hồ sơ và lịch sử vé.
- **Quản trị:** sáu mục tổng quan doanh thu/KPI/biểu đồ/đơn mới; quản lý phim và suất chiếu; rạp và phòng chiếu; tài khoản khách hàng; tài khoản nhân sự; doanh thu theo phim và danh sách vé. Các hành động quản trị trong bản mẫu gồm thêm/sửa/xóa dữ liệu mẫu và làm mới dữ liệu demo.
- **Tương tác và trạng thái:** lựa chọn phim/ngày/suất chiếu/ghế, tổng tiền, đồ ăn, thông tin tài khoản và vé đặt cần đồng bộ giữa các màn hình. Lưu trạng thái demo ở trình duyệt để không mất sau khi tải lại.

Đây là bản mẫu phía trình duyệt. Tài khoản, vé và số liệu là dữ liệu demo trên thiết bị/trình duyệt hiện tại; đăng nhập không thay thế xác thực máy chủ. Các phương thức QR/MoMo, ATM và thẻ chỉ mô phỏng giao diện, không thu tiền hoặc gửi vé thật. Không cấu hình máy chủ nghiệp vụ, cơ sở dữ liệu hay thông tin bí mật khi yêu cầu hiện tại chưa nêu tích hợp đó.

## Thiết kế

- **Tham chiếu:** tái hiện thẩm mỹ điện ảnh đêm và giao diện Cinetix trong HTML đính kèm; không thay bằng một hướng thiết kế khác.
- **Nguyên tắc:** poster là tâm điểm; tương phản rõ cho điều hướng/giá vé; bước đặt vé luôn có tóm tắt lựa chọn; khu vực quản trị ưu tiên bảng và số liệu dễ quét.
- **Màu sắc:** nền đen tím than tạo cảm giác phòng chiếu; hồng Cinetix làm màu hành động và trạng thái đang chọn; xanh lá biểu thị hoàn tất, vàng dành cho VIP/điểm nhấn.
- **Bố cục:** trang khách hàng theo dòng khám phá phim → chọn suất → chọn ghế/đồ ăn → thanh toán; tóm tắt đơn bám cạnh trong các bước đặt vé. Khu vực quản trị tách thanh điều hướng bên và vùng nội dung.
- **Motif:** dấu vé bo góc; viền hồng phát sáng nhẹ; đường cong màn chiếu và ghế được mã hóa màu.
- **Tương tác/chuyển động:** thao tác chọn phản hồi ngay bằng đổi màu và cập nhật tổng tiền; hover poster nhẹ; chuyển động ngắn, tiết chế; ưu tiên khả năng đọc và giảm hiệu ứng trên màn nhỏ.
- **Chữ:** Be Vietnam Pro theo tệp gốc; tiêu đề đậm, thông tin phụ có độ tương phản vừa đủ, giá và trạng thái được nhấn mạnh.
- **Định vị/giọng nói:** rạp phim gần gũi, giàu cảm xúc và tiện lợi; cá tính điện ảnh, rõ ràng, thân thiện. Ví dụ: “Một chiếc vé, ngàn câu chuyện.” và “Chọn ghế đẹp, bắt đầu buổi tối của bạn.”
- **Wordmark/logo:** chữ `cinetix` chữ thường bên cạnh biểu tượng vé chữ nhật bo góc; màu nhận diện hồng Cinetix.

## Kỹ thuật và cấu trúc

Dùng HTML, CSS và JavaScript thuần để chuyển trực tiếp bản tham chiếu, không thêm thư viện ứng dụng hoặc dịch vụ backend. Một HTTP server Node.js dùng module có sẵn phục vụ tệp và Preview trên cổng runtime 3000. Các màn hình bên trong là trạng thái của cùng tuyến `/`; khai báo tuyến đó trong `public/manus-routes.json`.

Cấu trúc dự kiến:

```text
cinetix/
├── index.html                 # Khung HTML và các màn hình khách/admin
├── src/
│   ├── styles.css             # Kiểu dáng, breakpoint và thành phần giao diện
│   └── app.js                 # Dữ liệu demo, luồng đặt vé và quản trị
├── public/
│   ├── manus-routes.json      # Khai báo tuyến trang gốc
│   └── cinetix-logo.svg       # Biểu tượng vé Cinetix và favicon
├── server.js                  # HTTP server Node.js không phụ thuộc thư viện ngoài
├── package.json               # Lệnh chạy dự án
├── app.config.ts              # URL HTTPS của logo dự án WebDev
├── README.md                  # Cách chạy và giới hạn bản demo
├── plan.md                    # Kế hoạch đã duyệt
└── TODO.md                    # Kết quả và tiêu chí phạm vi đã duyệt
```

Không tạo cơ sở dữ liệu/backend vì bản nguồn là giao diện HTML/JS tự chạy và người dùng không yêu cầu tích hợp thật. Preview được phục vụ tại runtime hiện có; kiểm tra phản hồi HTTP và các tệp tuyến. Không tự động xuất bản công khai; xuất bản (nếu muốn) là bước riêng sau.
