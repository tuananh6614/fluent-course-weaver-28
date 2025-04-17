
# EduHub Backend API

This is the backend API for the EduHub e-learning platform, built with Express.js and MySQL.

## Cấu trúc thư mục

```
backend/
├── config/         # Cấu hình kết nối cơ sở dữ liệu
├── controllers/    # Logic xử lý cho các API endpoint
├── middleware/     # Middleware (auth, error handling, etc.)
├── routes/         # Định nghĩa API routes
├── utils/          # Các tiện ích (JWT, validation, etc.)
├── .env.example    # Mẫu file cấu hình môi trường
├── database.sql    # Schema cơ sở dữ liệu
├── package.json    # Cấu hình npm
└── server.js       # Điểm khởi đầu ứng dụng
```

## Hướng dẫn cài đặt

1. Clone repository và di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```

2. Cài đặt các phụ thuộc:
   ```bash
   npm install
   ```

3. Tạo file cấu hình môi trường:
   ```bash
   cp .env.example .env
   ```

4. Chỉnh sửa file `.env` để phù hợp với môi trường của bạn.

5. Cài đặt và khởi động cơ sở dữ liệu MySQL:
   - Cài đặt XAMPP hoặc MySQL Server
   - Tạo database "eduhub"
   - Import file `database.sql` vào cơ sở dữ liệu

6. Khởi động server:
   ```bash
   npm start
   ```

   Hoặc chạy ở chế độ phát triển với nodemon:
   ```bash
   npm run dev
   ```

## API Endpoints

### Xác thực (Authentication)
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/verify-token` - Kiểm tra token
- `POST /api/auth/forgot-password` - Quên mật khẩu

### Người dùng (Users)
- `GET /api/users/profile` - Lấy thông tin người dùng
- `PUT /api/users/profile` - Cập nhật thông tin người dùng
- `PUT /api/users/change-password` - Đổi mật khẩu

### Khóa học (Courses)
- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy chi tiết khóa học
- `POST /api/courses` - Tạo khóa học mới (admin)
- `PUT /api/courses/:id` - Cập nhật khóa học (admin)
- `DELETE /api/courses/:id` - Xóa khóa học (admin)

### Chương (Chapters)
- `GET /api/courses/:courseId/chapters` - Lấy danh sách chương của khóa học
- `GET /api/chapters/:id` - Lấy chi tiết chương
- `POST /api/courses/:courseId/chapters` - Tạo chương mới (admin)
- `PUT /api/chapters/:id` - Cập nhật chương (admin)
- `DELETE /api/chapters/:id` - Xóa chương (admin)

### Bài học (Lessons)
- `GET /api/chapters/:chapterId/lessons` - Lấy danh sách bài học của chương
- `GET /api/lessons/:id` - Lấy chi tiết bài học
- `POST /api/chapters/:chapterId/lessons` - Tạo bài học mới (admin)
- `PUT /api/lessons/:id` - Cập nhật bài học (admin)
- `DELETE /api/lessons/:id` - Xóa bài học (admin)

### Đăng ký khóa học (Enrollments)
- `POST /api/courses/:courseId/enroll` - Đăng ký khóa học
- `GET /api/users/enrollments` - Lấy danh sách khóa học đã đăng ký
- `PUT /api/users/enrollments/:courseId/progress` - Cập nhật tiến độ khóa học

### Kiểm tra (Exams)
- `GET /api/courses/:courseId/exams` - Lấy danh sách bài kiểm tra của khóa học
- `GET /api/exams/:id` - Lấy chi tiết bài kiểm tra
- `POST /api/exams/:id/submit` - Nộp bài kiểm tra
- `POST /api/courses/:courseId/exams` - Tạo bài kiểm tra mới (admin)

### Chứng chỉ (Certificates)
- `POST /api/certificates/generate/:courseId` - Tạo chứng chỉ
- `GET /api/certificates/:id` - Lấy chi tiết chứng chỉ
- `GET /api/certificates/verify/:number` - Xác minh chứng chỉ

## Authentication

API sử dụng JWT (JSON Web Token) để xác thực. Để truy cập các API được bảo vệ:

1. Đăng nhập để lấy token
2. Thêm header `Authorization: Bearer <token>` vào các request

## Roles

- **user**: Người dùng thông thường, có thể đăng ký khóa học, học và làm bài kiểm tra
- **admin**: Quản trị viên, có thể tạo/sửa/xóa khóa học, chương, bài học, bài kiểm tra
