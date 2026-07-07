I. GIỚI THIỆU
- HUST Shop là một hệ thống thương mại điện tử toàn diện giúp người dùng mua sắm trực tuyến, và quản trị viên quản lý các mặt hàng, đơn hàng cũng như khách hàng.
- Hệ thống được xây dựng với kiến trúc client-server, chia làm 3 ứng dụng độc lập để dễ dàng phát triển, bảo trì và quản lý.
- Mục tiêu của dự án là cung cấp một nền tảng mua sắm mượt mà, giao diện thân thiện với người dùng và bảng điều khiển trực quan cho ban quản trị.

II. TOOL VÀ VERSION (CÔNG CỤ VÀ PHIÊN BẢN)
- Môi trường chạy:
  - Node.js (Tương thích tốt nhất với phiên bản v18.x đến v20.x).
  - Trình duyệt web (Google Chrome, Firefox hoặc Microsoft Edge phiên bản mới nhất).
- Backend (Server):
  - ExpressJS: ^4.19.2 (Framework để xây dựng RESTful API).
  - Mongoose: ^8.2.3 (Thư viện tương tác với cơ sở dữ liệu MongoDB).
  - bcrypt: ^5.1.1 (Thư viện dùng để mã hóa mật khẩu an toàn).
  - jsonwebtoken: ^9.0.2 (Thư viện quản lý bảo mật và xác thực người dùng qua JWT).
  - cloudinary: ^1.41.3 (Công cụ lưu trữ và quản lý hình ảnh trên đám mây).
  - nodemailer: ^6.9.13 (Thư viện hỗ trợ gửi email tự động).
  - cors: ^2.8.5 (Hỗ trợ Cross-Origin Resource Sharing để kết nối Front-end).
- Frontend (Admin và User):
  - AngularJS (Framework JavaScript để quản lý trạng thái, định tuyến và xử lý logic trên trình duyệt).
  - Bootstrap 5 (Framework CSS để tạo giao diện hiển thị tốt trên cả điện thoại và máy tính).

III. MÔ TẢ MODULE
- 1. Server Module:
  - Đóng vai trò là Backend cung cấp toàn bộ RESTful API cho các ứng dụng client.
  - Kết nối trực tiếp với cơ sở dữ liệu MongoDB để lưu trữ mọi thông tin của hệ thống như: sản phẩm, người dùng, đơn hàng, danh mục, mã giảm giá và bài viết (blog).
  - Tích hợp Cloudinary để tải lên và quản lý ảnh sản phẩm hiệu quả, giảm tải cho máy chủ.
  - Tích hợp hệ thống gửi email thông báo (Nodemailer) khi khách hàng đặt hàng thành công hoặc yêu cầu tạo tài khoản / cấp lại mật khẩu.
  - Tích hợp các middleware bảo mật như JWT để xác thực quyền đăng nhập, phân quyền truy cập rõ ràng giữa Admin và User thông thường, đảm bảo an toàn dữ liệu.
- 2. Admin Module:
  - Đây là ứng dụng giao diện quản lý dành riêng cho chủ cửa hàng hoặc ban quản trị.
  - Tính năng quản lý sản phẩm: Xem danh sách, thêm sản phẩm mới, sửa thông tin, xóa, cập nhật trạng thái hiển thị và quản lý số lượng tồn kho.
  - Tính năng quản lý đơn hàng: Theo dõi toàn bộ danh sách đơn hàng, thay đổi trạng thái giao hàng từ lúc đang chờ xử lý, đang giao, đến khi hoàn thành hoặc hủy đơn.
  - Tính năng quản lý người dùng: Kiểm soát danh sách khách hàng và các quản trị viên khác trên hệ thống, có thể khóa hoặc mở khóa tài khoản khi cần.
  - Quản lý nội dung khác: Quản lý danh mục sản phẩm, mã giảm giá, các bài viết tin tức (blog) hiển thị trên trang chủ.
- 3. User Module:
  - Đây là ứng dụng cửa hàng dành cho khách hàng cuối thao tác và mua sắm trên trình duyệt.
  - Giao diện chính (Trang chủ): Trưng bày các sản phẩm nổi bật, sản phẩm mới nhất, banner quảng cáo và các danh mục sản phẩm.
  - Tính năng mua sắm: Khách hàng có thể tìm kiếm sản phẩm theo tên, xem chi tiết mô tả và hình ảnh, thêm vào giỏ hàng và tiến hành thanh toán trực tuyến.
  - Tính năng tài khoản: Khách hàng có thể đăng ký tài khoản, đăng nhập, theo dõi lịch sử mua hàng, và cập nhật các thông tin cá nhân như họ tên, số điện thoại, địa chỉ nhận hàng.

IV. CÁCH CÀI ĐẶT VÀ CHẠY DỰ ÁN
- 1. Yêu cầu hệ thống trước khi cài đặt:
  - Máy tính đã cài đặt sẵn Node.js và npm.
  - Cơ sở dữ liệu MongoDB (Bạn có thể cài đặt phần mềm MongoDB tại máy hoặc sử dụng MongoDB Atlas trực tuyến).
  - Có sẵn một tài khoản Cloudinary để lấy thông tin lưu trữ ảnh.
  - Trình soạn thảo mã nguồn, khuyến nghị sử dụng Visual Studio Code.
- 2. Clone (Tải) Repository:
  - Mở terminal trên máy tính.
  - Sử dụng lệnh clone git về máy của bạn và di chuyển vào thư mục dự án (thư mục hustshop).
- 3. Cài đặt Backend (Server):
  - Mở terminal và truy cập vào thư mục con tên là Server.
  - Chạy lệnh: npm install (Lệnh này sẽ tự động tải toàn bộ thư viện cần thiết đã khai báo trong package.json).
  - Tạo một tệp mới có tên là .env (Lưu ý phải có dấu chấm ở đầu) bằng cách copy nội dung từ tệp .env.example hoặc tạo trắng.
  - Điền đầy đủ các biến môi trường vào tệp .env với cấu trúc và ý nghĩa như sau:
    - PORT: Cổng mạng để chạy server (ví dụ: 8081).
    - MONGO_URL: Chuỗi kết nối tới cơ sở dữ liệu MongoDB của bạn.
    - SECRET_KEY: Chuỗi ký tự ngẫu nhiên dùng để tạo token bảo mật, bạn có thể nhập một chuỗi bất kỳ tùy thích.
    - MAIL_NAME: Địa chỉ email thực của bạn để làm hộp thư gửi thông báo đi.
    - MAIL_PASSWORD: Mật khẩu ứng dụng (App Password) của email đó (lưu ý không dùng mật khẩu đăng nhập email thông thường).
    - URL: Địa chỉ URL của trang User để làm link dẫn về từ email (ví dụ http://127.0.0.1:5500).
    - CLOUDINARY_NAME: Tên tài khoản Cloudinary lấy trên bảng điều khiển.
    - CLOUDINARY_KEY: Mã API Key truy cập Cloudinary.
    - CLOUDINARY_SECRET: Mã API Secret bảo mật của Cloudinary.
- 4. Khởi tạo dữ liệu và chạy Server:
  - Vẫn trong thư mục Server, chạy lệnh: npm run createAdmin. Hệ thống sẽ tự động khởi tạo một tài khoản có quyền quản trị cao nhất và lưu vào Database để bạn đăng nhập lần đầu.
  - Khởi động Server cho môi trường phát triển bằng lệnh: npm run dev.
  - Nếu terminal báo kết nối database thành công thì Server đã được bật và sẵn sàng xử lý yêu cầu.
- 5. Cài đặt và chạy Frontend (Admin và User):
  - Do đây là các ứng dụng web dạng tĩnh (chỉ có HTML, CSS, JS), bạn không cần dùng lệnh npm install.
  - Cài đặt tiện ích mở rộng (Extension) có tên "Live Server" trong Visual Studio Code.
  - Để chạy giao diện Admin: Mở thư mục Admin trên Visual Studio Code, bấm chuột phải vào file index.html và chọn "Open with Live Server". Giao diện sẽ tự động mở lên trình duyệt.
  - Để chạy giao diện User: Làm tương tự, mở thư mục User trên Visual Studio Code, bấm chuột phải vào file index.html và chọn "Open with Live Server".

V. GHI CHÚ QUAN TRỌNG
- Hãy đảm bảo bạn điền chính xác MONGO_URL để server kết nối được dữ liệu.
- Để tính năng gửi email thành công, bắt buộc dùng Mật Khẩu Ứng Dụng (App Password) sinh ra từ Google Account, không dùng mật khẩu gmail.
- Luôn luôn phải bật Server (npm run dev) trước khi bạn đăng nhập hay tương tác trên giao diện Admin và User, nếu không sẽ không có dữ liệu hiển thị.
