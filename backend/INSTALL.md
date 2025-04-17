
# Hướng dẫn cài đặt EduHub Backend

## Yêu cầu hệ thống
- Node.js phiên bản 14.x trở lên
- MySQL phiên bản 5.7 trở lên (hoặc MariaDB phiên bản 10.4 trở lên)
- NPM phiên bản 6.x trở lên

## Các bước cài đặt

### 1. Chuẩn bị cơ sở dữ liệu

- Cài đặt MySQL Server hoặc XAMPP (đã bao gồm MySQL)
- Khởi động MySQL Server
- Tạo database mới với tên "eduhub":
  ```sql
  CREATE DATABASE eduhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
- Import file `database.sql` vào database vừa tạo:
  - Nếu dùng phpMyAdmin: Chọn database "eduhub" > Chọn tab "Import" > Chọn file `database.sql` > Nhấn "Go"
  - Nếu dùng command line:
    ```bash
    mysql -u your_username -p eduhub < database.sql
    ```

### 2. Cấu hình môi trường

- Sao chép file `.env.example` thành file `.env`:
  ```bash
  cp .env.example .env
  ```
- Mở file `.env` và cấu hình thông tin kết nối database:
  ```
  DB_HOST=localhost
  DB_USER=your_database_username
  DB_PASSWORD=your_database_password
  DB_NAME=eduhub
  DB_PORT=3306
  JWT_SECRET=your_secret_key_for_jwt
  PORT=5000
  ```

### 3. Cài đặt dependencies

- Cài đặt các gói phụ thuộc:
  ```bash
  npm install
  ```

### 4. Khởi động server

- Khởi động ở chế độ phát triển với nodemon (tự động khởi động lại khi có thay đổi code):
  ```bash
  npm run dev
  ```
- Hoặc khởi động ở chế độ thông thường:
  ```bash
  npm start
  ```

- Server sẽ chạy tại địa chỉ: http://localhost:5000 (hoặc port bạn đã cấu hình trong file .env)

### 5. Kiểm tra cài đặt

- Truy cập http://localhost:5000/ để xem thông báo "EduHub API is running"
- Kiểm tra một endpoint public: http://localhost:5000/api/courses

## Xử lý lỗi

### Lỗi kết nối database
- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin kết nối trong file .env
- Kiểm tra tài khoản có quyền truy cập vào database

### Lỗi port đã được sử dụng
- Thay đổi port trong file .env
- Hoặc dừng ứng dụng đang sử dụng port đó

### Lỗi thiếu module
- Chạy lại lệnh `npm install`
- Nếu lỗi vẫn tiếp tục, xóa thư mục node_modules và file package-lock.json, sau đó chạy lại `npm install`
