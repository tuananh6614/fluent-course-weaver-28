
-- Sample data for EduHub database
-- Run this file after setting up the database structure

-- Add admin and test users
INSERT INTO `users` (`full_name`, `email`, `password`, `role`, `status`, `phone`, `bio`) VALUES
('Admin User', 'admin@example.com', '$2a$10$dMR7CNoqo5u3u1V7U.FNYOOdxfkm5IzXxn0SSNAfRpAdFZH/vYyL2', 'admin', 'active', '0123456789', 'Quản trị viên hệ thống'),
('Test User', 'user@example.com', '$2a$10$dMR7CNoqo5u3u1V7U.FNYOOdxfkm5IzXxn0SSNAfRpAdFZH/vYyL2', 'user', 'active', '0987654321', 'Người dùng thử nghiệm');
-- Note: Both passwords are 'password123'

-- Add courses
INSERT INTO `courses` (`title`, `description`, `thumbnail`, `status`) VALUES
('Lập trình React.js cơ bản', 'Khóa học giúp bạn làm quen với thư viện React.js, xây dựng ứng dụng web hiện đại với JavaScript.', 'react-thumbnail.jpg', 'active'),
('Lập trình Node.js và Express', 'Học cách xây dựng RESTful API và ứng dụng web với Node.js và Express framework.', 'node-thumbnail.jpg', 'active'),
('Học MySQL toàn tập', 'Khóa học từ cơ bản đến nâng cao về hệ quản trị cơ sở dữ liệu MySQL.', 'mysql-thumbnail.jpg', 'active');

-- Add chapters for React course
INSERT INTO `chapters` (`course_id`, `title`, `description`, `chapter_order`) VALUES
(1, 'Giới thiệu React', 'Tổng quan về React và cài đặt môi trường phát triển', 1),
(1, 'Components và Props', 'Học về components và cách truyền dữ liệu với props', 2),
(1, 'State và Lifecycle', 'Quản lý trạng thái trong React và vòng đời component', 3);

-- Add chapters for Node course
INSERT INTO `chapters` (`course_id`, `title`, `description`, `chapter_order`) VALUES
(2, 'Giới thiệu Node.js', 'Tổng quan về Node.js và cài đặt môi trường', 1),
(2, 'Express Framework', 'Xây dựng web server với Express', 2),
(2, 'RESTful API', 'Thiết kế và xây dựng RESTful API', 3);

-- Add chapters for MySQL course
INSERT INTO `chapters` (`course_id`, `title`, `description`, `chapter_order`) VALUES
(3, 'Cơ sở dữ liệu quan hệ', 'Khái niệm cơ bản về cơ sở dữ liệu quan hệ', 1),
(3, 'SQL cơ bản', 'Các câu lệnh SQL cơ bản', 2),
(3, 'SQL nâng cao', 'Truy vấn phức tạp và tối ưu hóa', 3);

-- Add lessons for React chapters
INSERT INTO `lessons` (`chapter_id`, `title`, `content`, `lesson_order`) VALUES
(1, 'React là gì?', 'React là một thư viện JavaScript để xây dựng giao diện người dùng...', 1),
(1, 'Cài đặt môi trường', 'Hướng dẫn cài đặt Node.js, npm và tạo dự án React đầu tiên', 2),
(2, 'Functional Components', 'Cách tạo và sử dụng functional components trong React', 1),
(2, 'Class Components', 'Cách tạo và sử dụng class components trong React', 2),
(3, 'State trong React', 'Cách sử dụng state để quản lý dữ liệu trong components', 1),
(3, 'Vòng đời Component', 'Các phương thức lifecycle trong React components', 2);

-- Add lessons for Node chapters
INSERT INTO `lessons` (`chapter_id`, `title`, `content`, `lesson_order`) VALUES
(4, 'Node.js là gì?', 'Node.js là một runtime JavaScript xây dựng trên V8 engine của Chrome...', 1),
(4, 'Cài đặt Node.js', 'Hướng dẫn cài đặt Node.js và npm trên các hệ điều hành', 2),
(5, 'Tạo server với Express', 'Cách tạo web server đơn giản với Express', 1),
(5, 'Routing trong Express', 'Quản lý routes trong ứng dụng Express', 2),
(6, 'RESTful API là gì?', 'Giới thiệu về kiến trúc REST và RESTful API', 1),
(6, 'CRUD Operations', 'Xây dựng API với các thao tác CRUD cơ bản', 2);

-- Add lessons for MySQL chapters
INSERT INTO `lessons` (`chapter_id`, `title`, `content`, `lesson_order`) VALUES
(7, 'Khái niệm RDBMS', 'Giới thiệu về hệ quản trị cơ sở dữ liệu quan hệ', 1),
(7, 'Mô hình dữ liệu', 'Thiết kế mô hình dữ liệu cho ứng dụng', 2),
(8, 'SELECT, INSERT, UPDATE, DELETE', 'Các câu lệnh SQL cơ bản để thao tác dữ liệu', 1),
(8, 'JOIN các bảng', 'Cách kết hợp dữ liệu từ nhiều bảng', 2),
(9, 'Subqueries', 'Sử dụng truy vấn con trong SQL', 1),
(9, 'Indexes và Optimization', 'Tối ưu hiệu suất truy vấn với indexes', 2);

-- Add exams
INSERT INTO `exams` (`course_id`, `chapter_id`, `title`, `time_limit`, `total_questions`) VALUES
(1, 3, 'Kiểm tra React cơ bản', 30, 5),
(2, 6, 'Kiểm tra Node.js và Express', 30, 5),
(3, 9, 'Kiểm tra MySQL', 30, 5);

-- Add questions for React exam
INSERT INTO `questions` (`chapter_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`) VALUES
(3, 'React được phát triển bởi công ty nào?', 'Google', 'Facebook', 'Microsoft', 'Amazon', 'B'),
(3, 'Đâu không phải là hook trong React?', 'useState', 'useEffect', 'useParams', 'useStorage', 'D'),
(3, 'Virtual DOM trong React là gì?', 'DOM thật được hiển thị trên trình duyệt', 'Bản sao nhẹ của Real DOM', 'Thư viện DOM mới', 'Công cụ debug', 'B'),
(3, 'Để lấy tham số URL trong React Router, ta dùng hook nào?', 'useParams', 'useLocation', 'useHistory', 'useContext', 'A'),
(3, 'Phương thức nào được gọi sau khi component được render lần đầu tiên?', 'componentDidMount', 'componentWillMount', 'componentWillUpdate', 'componentDidUpdate', 'A');

-- Add questions for Node exam
INSERT INTO `questions` (`chapter_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`) VALUES
(6, 'Node.js sử dụng engine JavaScript nào?', 'SpiderMonkey', 'V8', 'Chakra', 'JavaScriptCore', 'B'),
(6, 'Để tạo server HTTP trong Node.js, ta sử dụng module nào?', 'fs', 'path', 'http', 'crypto', 'C'),
(6, 'Trong Express, middleware là gì?', 'Thư viện UI', 'Hàm xử lý request/response', 'Database connector', 'Template engine', 'B'),
(6, 'Phương thức HTTP nào thường dùng để cập nhật dữ liệu?', 'GET', 'POST', 'PUT', 'DELETE', 'C'),
(6, 'NPM là viết tắt của?', 'Node Package Manager', 'Node Project Manager', 'Node Process Monitor', 'Node Public Modules', 'A');

-- Add questions for MySQL exam
INSERT INTO `questions` (`chapter_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`) VALUES
(9, 'Loại JOIN nào trả về tất cả bản ghi từ bảng bên trái kể cả khi không có kết nối với bảng bên phải?', 'INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL JOIN', 'C'),
(9, 'Câu lệnh nào dùng để tạo khóa chính?', 'PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE KEY', 'INDEX KEY', 'A'),
(9, 'Để sắp xếp kết quả truy vấn, ta dùng mệnh đề nào?', 'SORT BY', 'ORDER BY', 'ARRANGE BY', 'GROUP BY', 'B'),
(9, 'Hàm SQL nào dùng để đếm số bản ghi?', 'SUM()', 'COUNT()', 'AVG()', 'MAX()', 'B'),
(9, 'Để kết hợp nhiều điều kiện trong WHERE, ta dùng toán tử nào?', 'AND/OR', 'WITH', 'COMBINE', 'HAVING', 'A');

-- Add enrollments
INSERT INTO `enrollment` (`course_id`, `user_id`, `progress_percent`, `status`) VALUES
(1, 2, 30.00, 'enrolled'),
(2, 2, 0.00, 'enrolled');

-- Add user exam attempts
INSERT INTO `user_exam` (`exam_id`, `user_id`, `attempt_count`, `score`, `status`) VALUES
(1, 2, 1, 60.00, 'fail');
