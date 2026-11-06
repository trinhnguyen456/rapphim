# Kế hoạch triển khai — Cinetix

## Phạm vi sản phẩm

Dựng website tiếng Việt dựa trên tệp `!DOCTYPE1.html` do người dùng cung cấp. Giữ nhận diện Cinetix, nội dung mẫu, phong cách giao diện tối với điểm nhấn hồng và các luồng tương tác quan trọng:

- **Khách hàng:** trang phim đang chiếu/sắp chiếu, thông tin phim và trailer, lịch chiếu theo ngày/rạp, chọn ghế thường/VIP/ghế đôi, chọn bắp nước, thông tin người mua, chọn cách thanh toán mô phỏng, mã QR/vé điện tử, đăng ký/đăng nhập, hồ sơ và lịch sử vé.
- **Quản trị:** sáu mục tổng quan doanh thu/KPI/biểu đồ/đơn mới; quản lý phim và suất chiếu; rạp và phòng chiếu; tài khoản khách hàng; tài khoản nhân sự; doanh thu theo phim và danh sách vé. Các hành động quản trị trong bản mẫu gồm thêm/sửa/xóa dữ liệu mẫu và làm mới dữ liệu demo.
- **Tương tác và trạng thái:** lựa chọn phim/ngày/suất chiếu/ghế, tổng tiền, đồ ăn, thông tin tài khoản và vé đặt cần đồng bộ giữa các màn hình. Dữ liệu nghiệp vụ được lưu qua API trong MySQL Managed, không dùng localStorage làm nguồn dữ liệu.

Đây là website demo có dữ liệu nghiệp vụ dùng chung trong DB Managed; phiên đăng nhập và quyền admin được xác minh ở máy chủ. Các phương thức QR/MoMo, ATM và thẻ chỉ mô phỏng, không thu tiền hoặc phát hành vé đã thanh toán. Preview và website live chia sẻ DB; dữ liệu localStorage cũ trên thiết bị không tự được nhập vào DB.

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

## Kỹ thuật, dữ liệu và cấu trúc

Giữ HTML, CSS và JavaScript hiện tại ở giao diện người dùng, nhưng chuyển dữ liệu nghiệp vụ sang API Node.js và MySQL Managed. Máy chủ Node phục vụ cả HTML/CSS/JS lẫn `/api/*`; `mysql2/promise` là thư viện runtime được ghim phiên bản và có lockfile. Mật khẩu tài khoản băm/xác minh bằng `crypto.scrypt` bất đồng bộ; ba bộ đếm login/register/booking dùng chung trong MySQL giới hạn lần lượt 300/100/100 yêu cầu mỗi cửa sổ 15 phút trên toàn bộ instance. API chỉ chấp nhận ba scope cố định; primary key cho phép tối đa một counter cho mỗi scope, không lưu IP. Session opaque ngẫu nhiên lưu dạng hash trong DB và cookie `HttpOnly`, `Secure`, `SameSite=None` tương thích HTTPS/Preview. Không dùng localStorage làm nguồn xác thực hay sổ ghế bán.

Migration SQL đánh số, lặp lại an toàn và chỉ tạo/cập nhật cấu trúc theo hướng additive; bảng migration ghi nhận bước đã chạy. Tạo catalog mẫu chỉ khi bảng tương ứng rỗng, tuyệt đối không seed đè dữ liệu đã chỉnh. Tạo lịch mẫu cho bảy ngày kế tiếp theo `Asia/Ho_Chi_Minh` để tránh hiển thị suất đã qua; các suất/phim/giá/booking đều ghi rõ là dữ liệu demo. Các thực thể gồm khách hàng/nhân viên và vai trò, session, ba bộ đếm request giới hạn cố định, phim, rạp, phòng, suất chiếu, đơn vé, ghế trong đơn và món bắp nước. DB Managed được chia sẻ giữa Preview và production; kiểm thử chỉ đọc hoặc dùng thao tác tạo bản ghi thử có dọn cụ thể, không chạy migration phá hủy hay reset dữ liệu live.

Server tự xác minh quyền ở mọi API quản trị; ẩn giao diện admin ở client không được coi là ranh giới bảo mật. Tài khoản admin đầu tiên được seed theo biến bảo mật nhập qua thẻ bí mật, không lưu trong Git, không in ra log. Quy trình đặt vé kiểm tra giá và ghế trên server rồi tạo booking/ghế bằng transaction, ràng buộc duy nhất theo suất + ghế để tránh bán trùng. Phương thức QR/MoMo/ATM/thẻ vẫn là mô phỏng; đơn được ghi nhãn xác nhận demo, không nhận số thẻ, không thu tiền và không khẳng định đã thanh toán thật.

Phát hành bằng Docker container: Dockerfile cài dependency từ lockfile, phục vụ tệp giao diện và API trên `PORT` (mặc định 3000), đồng thời cung cấp `/_app/health` không cần đăng nhập. Migration có phiên bản được chạy rõ ràng trước khi khởi động/công bố; container chỉ bind listener nhanh để healthcheck không chờ seed. Khai báo `features.server=true`, `features.database=true` và `deploy.healthPath="/_app/health"`. Không cần static `build` riêng vì container phục vụ cả website và API. `public/manus-routes.json` tiếp tục khai báo trang `/`. Sau khi push checkpoint lên GitHub canonical, dùng Publish đã được người dùng yêu cầu để phát hành công khai; không bật auto-publish.

**Phạm vi dữ liệu cũ:** dữ liệu localStorage ở từng trình duyệt không phải bản ghi tập trung và không thể tự hợp nhất an toàn; không tự nhập nó vào DB. Lần khởi tạo chỉ đưa bộ phim/rạp/phòng/nhân sự/suất chiếu/món mẫu vào các bảng trống. Khu admin không có thao tác xóa/reset toàn bộ DB live. Trước khi vận hành với khách thật, người quản trị cần kiểm tra dữ liệu mẫu và nội dung thông báo quyền riêng tư. Không có môi trường staging riêng; Preview và website live dùng chung DB, nên migrations và writes phải được coi là tác động tới dữ liệu live.

```text
cinetix/
├── index.html                 # Khung giao diện khách hàng và admin
├── src/styles.css             # Nhận diện, responsive và print styles
├── src/app.js                 # Khung giao diện/state tương thích
│   ├── api-client.js          # HTTP cùng origin, credentials và CSRF
│   └── api-app.js             # Gắn giao diện với API, booking và admin
├── public/
│   ├── manus-routes.json      # Tuyến trang gốc
│   └── cinetix-logo.svg       # Logo/favicon
├── server.js                  # HTTP server, route dispatch và health
├── server/
│   ├── api.js                 # REST routes, validation, booking transaction, admin queries
│   └── security.js            # Password scrypt, sessions, CSRF và role checks
├── db/                        # Kết nối MySQL, seed và schema migrations tăng phiên bản
├── scripts/migrate.js         # Migration additive, seed không ghi đè và admin bootstrap
├── Dockerfile                 # Build và khởi chạy container production
├── package.json + lockfile    # Dependency/pin toolchain
├── app.config.ts              # URL HTTPS logo WebDev
├── README.md                  # Chạy, secrets, migration và giới hạn thanh toán
├── plan.md                    # Kế hoạch
└── TODO.md                    # Tiêu chí đã duyệt
```
