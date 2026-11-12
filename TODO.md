# TODO — Cinetix

- [x] **Trang khám phá phim và thông tin chiếu**
  - Trang chủ có tiêu điểm “DƯỚI BẦU TRỜI SAO”, nút “Đặt vé ngay” và “Xem trailer”; thanh đặt vé nhanh chọn phim, rạp, ngày, giờ.
  - Thư viện đang chiếu có đủ 8 phim trong dữ liệu mẫu: “Dưới bầu trời sao”, “Thành phố không ngủ”, “Sau cánh rừng”, “Mùa hè rực rỡ”, “LILO & STITCH”, “TỪ VŨ TRỤ JOHN WICK: BALLERINA”, “BỘ 5 SIÊU ĐẲNG CẤP”, “DƯỚI ĐÁY HỒ”; hiển thị poster, giới hạn tuổi, thể loại, thời lượng và nút đặt vé.
  - Khu “Sắp lên màn ảnh” hiển thị “Chuyến tàu bình minh” (08/11), “Những điều chưa nói” (15/11), “Bên kia đại dương” (22/11); có khối hệ thống rạp/địa điểm TP. Hồ Chí Minh, Bến Tre, Hà Nội, Trà Vinh và khối ưu đãi.
  - Chọn phim mở trang chi tiết với poster, thể loại, thời lượng, giới hạn tuổi, ngày khởi chiếu, mô tả, đạo diễn, diễn viên; trailer có thể mở/đóng; nút mua vé đưa người dùng tới lịch chiếu.

- [x] **Lịch chiếu, chọn rạp và chọn ghế**
  - Dải lịch chiếu có 7 ngày kế tiếp theo múi giờ Asia/Ho_Chi_Minh; đổi ngày/rạp/suất chiếu cập nhật lựa chọn đặt vé.
  - Có các suất mẫu tại Cinetix Landmark 81 (14:00, 16:45, 19:30, 22:00), Crescent Mall (15:15, 18:00, 20:45), Bến Tre 1 (21:00) và Hà Nội 1 (10:30), kèm tên phòng.
  - Sơ đồ gồm hàng A–F, mỗi hàng 12 ghế; A–C là ghế thường 95.000đ, D–F là ghế VIP 115.000đ; hàng G có 6 ghế đôi, mỗi ghế 190.000đ. Ghế đã bán bị khóa; ghế chọn được đánh dấu; lựa chọn có thể bỏ bằng cách bấm lại.
  - Tóm tắt phim/rạp/ngày/giờ/phòng/ghế và tổng tiền được đồng bộ. Không thể tiếp tục chọn bắp nước hoặc thanh toán nếu chưa chọn ghế. Các bước đặt vé hiển thị thanh tiến trình và nhãn giữ ghế như bản mẫu.

- [x] **Bắp nước, thông tin mua vé và phương thức thanh toán mô phỏng**
  - Danh mục có bộ lọc “Tất cả món”, “Combo tiết kiệm”, “Bắp rang”, “Nước uống”; gồm Combo Một mình vui 69.000đ, Bắp giòn yêu thích 45.000đ, Coca Cola/Fanta 40.000đ, Milo/Sprite/Trà đào 25.000đ; chọn hương vị và tăng/giảm số lượng từ 0.
  - Tóm tắt vé, đồ ăn và tổng tiền cập nhật theo giá/mỗi số lượng; có thể bỏ qua bắp nước và quay lại chọn ghế.
  - Checkout yêu cầu họ tên, số điện thoại và email; đăng nhập sẽ điền thông tin đã lưu. Chỉ mở modal QR khi đã có ghế và đủ ba trường bắt buộc; cho phép quay lại đóng modal.
  - Có ba lựa chọn mô phỏng: QR (MoMo/VNPay/Cinetix), ATM nội địa và thẻ quốc tế Visa/Master/Amex/JCB; cần tích đồng ý điều khoản và xác nhận độ tuổi. Không xử lý thanh toán thật, không gửi tiền hoặc phát hành vé thật.

- [x] **Vé điện tử demo và đồng bộ doanh thu/lịch sử**
  - Hoàn tất đơn tạo mã vé, mã QR demo và vé hiển thị phim, rạp, ngày, giờ, phòng, ghế, khách mua, số vé, bắp nước, phương thức thanh toán và tổng tiền; nút in/tải vé, xem lịch sử, xem doanh thu quản trị và về trang chủ hoạt động.
  - Ghế được đánh dấu đã bán cho đúng suất chiếu; doanh thu, tổng vé, số vé/doanh thu theo phim, số ghế đã bán và danh sách vé gần đây/toàn bộ tăng theo đơn đã hoàn tất.
  - Tài khoản, phim, rạp, nhân sự, suất chiếu, đơn vé, món ăn và thống kê đọc/ghi qua server vào MySQL Managed dùng chung, không dùng localStorage làm nguồn dữ liệu nghiệp vụ; dữ liệu vẫn có sau khi tải lại/truy cập từ thiết bị khác.

- [x] **Đăng ký, đăng nhập, hồ sơ và lịch sử vé**
  - Đăng ký yêu cầu họ tên, email, số điện thoại, mật khẩu tối thiểu 6 ký tự và xác nhận mật khẩu; báo lỗi khi thiếu trường, mật khẩu không đủ độ dài/không khớp hoặc email đã đăng ký; đăng ký thành công vào hồ sơ.
  - Đăng nhập yêu cầu email/mật khẩu của tài khoản đã đăng ký; hiển thị lỗi khi chưa có tài khoản hoặc thông tin sai; đăng xuất trở về trạng thái chưa đăng nhập. Khi chưa đăng nhập, mở hồ sơ yêu cầu đăng nhập.
  - Hồ sơ cho phép cập nhật họ tên/email/số điện thoại/ngày sinh; họ tên/email không được bỏ trống; hiển thị số vé, vé sắp chiếu, tổng chi tiêu và lịch sử vé của khách.
  - Sau khi đăng nhập, tên/ảnh chữ cái tài khoản hiển thị trên thanh điều hướng và thông tin tài khoản được điền vào form checkout. Đơn đặt vé gắn với khách tương ứng.

- [x] **Sáu khu vực quản trị và thao tác dữ liệu demo**
  - Có đúng sáu tab: Tổng quan; Phim & Suất chiếu; Rạp & Phòng chiếu; Tài khoản người dùng; Tài khoản nhân sự; Vé đã đặt & Doanh thu. Có breadcrumb và liên kết quay về website; không có nút xóa/reset toàn bộ database live.
  - Tổng quan ban đầu có doanh thu 0đ, 0 vé, 0% lấp đầy, 0 thành viên; biểu đồ doanh thu 7 ngày gần đây theo giờ Việt Nam, phim dẫn đầu và bảng vé gần đây. Khi đặt vé/đăng ký thành công, KPI, biểu đồ, phim dẫn đầu, số ghế và bảng vé được đồng bộ.
  - Quản lý phim hiển thị 8 phim mẫu; form thêm/sửa có mã phim, tên, thời lượng, giới hạn tuổi T13/T16/T18/P/K, thể loại, ngày phát hành, trạng thái và mô tả; lưu và xóa cập nhật danh sách trang chủ/đặt vé/doanh thu.
  - Bảng suất chiếu mẫu hiển thị giờ, ngày trong 7 ngày kế tiếp, phòng, định dạng 2D phụ đề, giá cơ bản 95.000đ, sức chứa 78 ghế và trạng thái mở bán; chọn dòng cho phép chỉnh sửa giờ và giá.
  - Quản lý rạp bắt đầu với 5 cụm: Landmark 81, Crescent Mall, Bến Tre 1, Hà Nội 1, Trà Vinh 1; quản lý phòng bắt đầu với 4 phòng mẫu, mỗi phòng 78 ghế. Có thể thêm/xóa rạp và phòng mẫu.
  - Danh sách tài khoản khách hàng có tên, email, số điện thoại, vai trò, trạng thái; có thể thêm/xóa. Danh sách nhân sự bắt đầu với Daniel, Alice (Nguyễn Hoàng), Elisa, Bob, Helen; hiển thị mã, liên hệ, vai trò admin/employee, trạng thái và thao tác thêm/xóa.
  - Mục vé/doanh thu hiển thị doanh thu và số vé theo từng phim cùng toàn bộ đơn: khách hàng, phim, rạp/phòng, suất chiếu, ghế, bắp nước, tổng tiền.

- [x] **Phong cách, khả năng sử dụng và phục vụ website**
  - Giữ nội dung tiếng Việt và phong cách từ HTML mẫu: nền đen/tím, điểm nhấn hồng, Be Vietnam Pro, biểu tượng vé Cinetix, poster phim và trạng thái/badge tương ứng; dùng ảnh mẫu hiện có.
  - Các màn hình khách hàng và quản trị hiển thị, cuộn và thao tác được ở desktop, tablet và màn hình điện thoại; bảng/sơ đồ ghế không làm vỡ bố cục nhỏ.
  - Website dùng Node container trên `PORT` (mặc định 3000), health endpoint công khai `/_app/health`, tuyến trang `/` trong `public/manus-routes.json`; container phục vụ cả UI và API.
  - Bật backend và MySQL Managed; Preview và production dùng chung DB. Migrations có phiên bản, lặp lại an toàn, không xóa/ghi đè dữ liệu; chỉ seed catalog khi bảng còn trống. Không tự nhập localStorage rời rạc vào DB.

- [x] **Backend và cơ sở dữ liệu MySQL**
  - Tạo migrations SQL có phiên bản và bảng cần thiết cho tài khoản/vai trò/session, rate limit login/register/booking có đúng ba scope cố định, phim, rạp, phòng, suất chiếu, đơn đặt, ghế theo đơn và chi tiết bắp nước; dùng khóa/unique constraints phù hợp, đặc biệt unique `(showtime_id, seat_code)`.
  - Đọc DSN từ `DATABASE_URL` của Managed DB, cấu hình driver với TLS; migration chạy lại an toàn, giữ lịch sử migration, không phụ thuộc dữ liệu seed trên startup. Seed 8 phim, 5 rạp, 4 phòng, 5 mục nhân sự mẫu chỉ vào bảng rỗng; không ghi đè sửa đổi sau này.
  - Dùng transaction cho tạo đơn và ghế; xác minh suất chiếu, trạng thái ghế và giá trên server, trả lỗi rõ ràng khi ghế đã bị đặt. Tổng doanh thu/số vé quản trị được tính từ đơn hợp lệ trong database.
  - Không thực hiện reset, truncate hay xóa dữ liệu live trong quá trình phát triển; không tuyên bố localStorage từ các trình duyệt đã được nhập vào DB.

- [x] **Đăng nhập server-side và phân quyền admin**
  - Đăng ký/đăng nhập hiện có tiếp tục dùng email/mật khẩu; email duy nhất; mật khẩu không lưu văn bản thuần, băm/xác minh bằng `crypto.scrypt` bất đồng bộ và salt riêng. Hồ sơ cập nhật, lịch sử vé và số chi tiêu lấy theo user đang xác thực từ server.
  - Tạo và thu hồi phiên trên server bằng token ngẫu nhiên, chỉ lưu hash; cookie `HttpOnly; Secure; SameSite=None` cho HTTPS/Preview; logout xóa phiên. Không đặt token hay password trong localStorage, response công khai, Git hoặc log.
  - Mọi `/api/admin/*` phải xác thực role admin ở server; người chưa đăng nhập/non-admin bị từ chối, kể cả gọi API trực tiếp. Không dựa vào việc ẩn tab admin phía trình duyệt.
  - Tài khoản admin đầu tiên dùng email/mật khẩu nhận qua thẻ nhập bí mật, tạo/seed an toàn và lặp lại không tạo admin trùng; không có mật khẩu mẫu tĩnh. Thông tin bí mật không in ra log.
  - Cookie, CSRF/origin và body-size/content-type được kiểm tra; không bật CORS wildcard. Profile chỉ đọc/sửa dữ liệu của chính tài khoản. Throttle dùng ba counter MySQL chia sẻ giữa mọi instance: đăng nhập tối đa 300 lần, đăng ký 100 lần và tạo booking 100 lần trong mỗi cửa sổ 15 phút; chỉ ba bucket cố định, không lưu địa chỉ IP và không dùng Map in-memory theo từng IP.

- [ ] **Đổi mật khẩu tài khoản đang đăng nhập**
  - Trong Hồ sơ, người dùng có thể nhập mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu mới; máy chủ xác minh mật khẩu hiện tại, yêu cầu hai mật khẩu mới khớp và áp dụng quy tắc hiện có từ 6 đến 256 ký tự.
  - Chỉ tài khoản đang xác thực có thể đổi mật khẩu của chính mình; mật khẩu mới được băm bằng `crypto.scrypt` với salt riêng, không lưu hay ghi log mật khẩu thuần.
  - Khi đổi thành công, máy chủ thu hồi mọi phiên của tài khoản và xóa cookie phiên hiện tại; giao diện thông báo người dùng cần đăng nhập lại bằng mật khẩu mới. CSRF protection vẫn được áp dụng.

- [x] **Giao diện quản trị nối API và dữ liệu dùng chung**
  - Sáu tab tổng quan, phim/suất chiếu, rạp/phòng, khách, nhân sự và vé/doanh thu tải qua API; CRUD chỉ thành công với admin, kiểm tra dữ liệu/ID phía server và ghi bền vững trong DB.
  - Thêm/sửa/xóa phim cập nhật catalog công khai; cập nhật rạp/phòng/suất chiếu ảnh hưởng các lựa chọn booking nhưng không xóa đơn/ghế lịch sử. Chỉ role admin được thay đổi; khách chỉ đọc nội dung công khai.
  - Thống kê tổng doanh thu/vé/khách, doanh thu theo phim, suất bán và đơn gần đây được tính từ DB; nhãn trạng thái vẫn thể hiện booking demo, không “đã thanh toán” thật.
  - Không cung cấp API hoặc nút “Đặt lại toàn bộ về 0” trên môi trường live; xóa tài khoản cá nhân không xóa snapshot vé hay dữ liệu doanh thu lịch sử.

- [ ] **Container production và xuất bản công khai**
  - Khai báo `features.server=true`, `features.database=true`, Dockerfile và `deploy.healthPath="/_app/health"`; server bind `0.0.0.0:$PORT` (mặc định 3000), health trả 2xx không cần login.
  - Dockerfile cài đúng dependency từ lockfile, không cần `.env`/secret ở build-time, đọc `DATABASE_URL` ở runtime, không ghi dữ liệu bền vững vào filesystem container; chạy migrations rõ ràng trước khi publish, không chặn health listener khi khởi động.
  - Push mã đã kiểm tra lên `main` của GitHub canonical, rồi dùng Publish công khai theo yêu cầu. Auto-publish giữ tắt; không báo URL công khai đến khi job Publish xác nhận thành công.
  - Website hiển thị thông báo rõ email/số điện thoại/hồ sơ/đơn được lưu trong database, và phim/lịch/giá/vé là dữ liệu demo; QR/MoMo/ATM/thẻ vẫn hoàn toàn mô phỏng, không thu số thẻ, không gửi tiền, không phát hành vé thanh toán thật.
