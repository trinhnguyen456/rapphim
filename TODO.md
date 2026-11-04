# TODO — Cinetix

- [x] **Trang khám phá phim và thông tin chiếu**
  - Trang chủ có tiêu điểm “DƯỚI BẦU TRỜI SAO”, nút “Đặt vé ngay” và “Xem trailer”; thanh đặt vé nhanh chọn phim, rạp, ngày, giờ.
  - Thư viện đang chiếu có đủ 8 phim trong dữ liệu mẫu: “Dưới bầu trời sao”, “Thành phố không ngủ”, “Sau cánh rừng”, “Mùa hè rực rỡ”, “LILO & STITCH”, “TỪ VŨ TRỤ JOHN WICK: BALLERINA”, “BỘ 5 SIÊU ĐẲNG CẤP”, “DƯỚI ĐÁY HỒ”; hiển thị poster, giới hạn tuổi, thể loại, thời lượng và nút đặt vé.
  - Khu “Sắp lên màn ảnh” hiển thị “Chuyến tàu bình minh” (08/11), “Những điều chưa nói” (15/11), “Bên kia đại dương” (22/11); có khối hệ thống rạp/địa điểm TP. Hồ Chí Minh, Bến Tre, Hà Nội, Trà Vinh và khối ưu đãi.
  - Chọn phim mở trang chi tiết với poster, thể loại, thời lượng, giới hạn tuổi, ngày khởi chiếu, mô tả, đạo diễn, diễn viên; trailer có thể mở/đóng; nút mua vé đưa người dùng tới lịch chiếu.

- [x] **Lịch chiếu, chọn rạp và chọn ghế**
  - Dải ngày cho 30/10/2026 đến 05/11/2026; đổi ngày/rạp/suất chiếu cập nhật lựa chọn đặt vé.
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
  - Dữ liệu tài khoản, phim, rạp, nhân sự, booking và thống kê là dữ liệu demo cục bộ; lưu/khôi phục sau khi tải lại trang trên cùng trình duyệt. Chức năng “Đặt lại toàn bộ về 0” yêu cầu xác nhận rồi xóa dữ liệu demo và đặt trạng thái thống kê về 0.

- [x] **Đăng ký, đăng nhập, hồ sơ và lịch sử vé**
  - Đăng ký yêu cầu họ tên, email, số điện thoại, mật khẩu tối thiểu 6 ký tự và xác nhận mật khẩu; báo lỗi khi thiếu trường, mật khẩu không đủ độ dài/không khớp hoặc email đã đăng ký; đăng ký thành công vào hồ sơ.
  - Đăng nhập yêu cầu email/mật khẩu của tài khoản đã đăng ký; hiển thị lỗi khi chưa có tài khoản hoặc thông tin sai; đăng xuất trở về trạng thái chưa đăng nhập. Khi chưa đăng nhập, mở hồ sơ yêu cầu đăng nhập.
  - Hồ sơ cho phép cập nhật họ tên/email/số điện thoại/ngày sinh; họ tên/email không được bỏ trống; hiển thị số vé, vé sắp chiếu, tổng chi tiêu và lịch sử vé của khách.
  - Sau khi đăng nhập, tên/ảnh chữ cái tài khoản hiển thị trên thanh điều hướng và thông tin tài khoản được điền vào form checkout. Đơn đặt vé gắn với khách tương ứng.

- [x] **Sáu khu vực quản trị và thao tác dữ liệu demo**
  - Có đúng sáu tab: Tổng quan; Phim & Suất chiếu; Rạp & Phòng chiếu; Tài khoản người dùng; Tài khoản nhân sự; Vé đã đặt & Doanh thu. Có breadcrumb, liên kết quay về website và thao tác đặt lại dữ liệu.
  - Tổng quan ban đầu có doanh thu 0đ, 0 vé, 0% lấp đầy, 0 thành viên; biểu đồ doanh thu 25–31/10/2026, phim dẫn đầu và bảng vé gần đây. Khi đặt vé/đăng ký thành công, KPI, biểu đồ, phim dẫn đầu, số ghế và bảng vé được đồng bộ.
  - Quản lý phim hiển thị 8 phim mẫu; form thêm/sửa có mã phim, tên, thời lượng, giới hạn tuổi T13/T16/T18/P/K, thể loại, ngày phát hành, trạng thái và mô tả; lưu và xóa cập nhật danh sách trang chủ/đặt vé/doanh thu.
  - Bảng suất chiếu mẫu hiển thị giờ, ngày 31/10/2026, phòng, định dạng 2D phụ đề, giá cơ bản 95.000đ, sức chứa 78 ghế và trạng thái mở bán; chọn dòng cho phép chỉnh sửa giờ và giá.
  - Quản lý rạp bắt đầu với 5 cụm: Landmark 81, Crescent Mall, Bến Tre 1, Hà Nội 1, Trà Vinh 1; quản lý phòng bắt đầu với 4 phòng mẫu, mỗi phòng 78 ghế. Có thể thêm/xóa rạp và phòng mẫu.
  - Danh sách tài khoản khách hàng có tên, email, số điện thoại, vai trò, trạng thái; có thể thêm/xóa. Danh sách nhân sự bắt đầu với Daniel, Alice (Nguyễn Hoàng), Elisa, Bob, Helen; hiển thị mã, liên hệ, vai trò admin/employee, trạng thái và thao tác thêm/xóa.
  - Mục vé/doanh thu hiển thị doanh thu và số vé theo từng phim cùng toàn bộ đơn: khách hàng, phim, rạp/phòng, suất chiếu, ghế, bắp nước, tổng tiền.

- [x] **Phong cách, khả năng sử dụng và phục vụ website**
  - Giữ nội dung tiếng Việt và phong cách từ HTML mẫu: nền đen/tím, điểm nhấn hồng, Be Vietnam Pro, biểu tượng vé Cinetix, poster phim và trạng thái/badge tương ứng; dùng ảnh mẫu hiện có.
  - Các màn hình khách hàng và quản trị hiển thị, cuộn và thao tác được ở desktop, tablet và màn hình điện thoại; bảng/sơ đồ ghế không làm vỡ bố cục nhỏ.
  - Website chạy trên runtime hiện có tại cổng 3000, tuyến trang `/` được khai báo trong `public/manus-routes.json`; không bật backend, cơ sở dữ liệu hoặc tích hợp thanh toán thật, và không tự xuất bản công khai.
