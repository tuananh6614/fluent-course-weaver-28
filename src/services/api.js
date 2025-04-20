
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Course Service - Methods for interacting with course-related endpoints
export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      // For now, we'll return some mock data as the backend might not be ready
      // In a real app, you would use: return await api.get('/courses');
      return {
        data: [
          {
            course_id: 1,
            title: "Lập Trình JavaScript Cơ Bản",
            instructor: "Nguyen Van A",
            thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613",
            category: "Lập trình",
            rating: 4.8,
            students: 1200,
            duration: "12 giờ",
            price: 199000,
            created_at: "2023-01-15"
          },
          {
            course_id: 2,
            title: "Thiết Kế UX/UI Hiện Đại",
            instructor: "Tran Thi B",
            thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
            category: "Thiết kế",
            rating: 4.6,
            students: 850,
            duration: "10 giờ",
            price: 249000,
            created_at: "2023-02-20"
          },
          {
            course_id: 3,
            title: "Marketing Số Cho Người Mới Bắt Đầu",
            instructor: "Le Van C",
            thumbnail: "https://images.unsplash.com/photo-1557838923-2985c318be48",
            category: "Marketing",
            rating: 4.5,
            students: 920,
            duration: "8 giờ",
            price: 179000,
            created_at: "2023-03-10"
          },
          {
            course_id: 4,
            title: "Phát Triển Ứng Dụng Web với React",
            instructor: "Pham Thi D",
            thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
            category: "Lập trình",
            rating: 4.9,
            students: 1500,
            duration: "15 giờ",
            price: 299000,
            created_at: "2023-04-05"
          }
        ]
      };
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
  
  // Get course by id
  getCourseById: async (id) => {
    try {
      // For now, return mock data
      // In a real app: return await api.get(`/courses/${id}`);
      return {
        data: {
          course_id: Number(id),
          title: `Khóa học ${id}`,
          instructor_name: "Giảng viên giỏi",
          instructor_title: "Chuyên gia lập trình",
          instructor_avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          instructor_bio: "Chuyên gia với nhiều năm kinh nghiệm giảng dạy và phát triển phần mềm.",
          thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613",
          category: "Lập trình",
          level: "Trung cấp",
          rating: 4.8,
          students: 1200,
          duration: "12 giờ",
          price: 199000,
          description: "Khóa học này sẽ giúp bạn hiểu rõ về các khái niệm cơ bản và nâng cao, giúp bạn xây dựng nền tảng vững chắc.",
          projects_count: 5,
          resources_count: 25,
          chapters: [
            {
              chapter_id: 1,
              title: "Giới thiệu",
              lessons_count: 3
            },
            {
              chapter_id: 2,
              title: "Cơ bản",
              lessons_count: 5
            },
            {
              chapter_id: 3,
              title: "Nâng cao",
              lessons_count: 4
            }
          ]
        }
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
  
  // Get chapter lessons
  getChapterLessons: async (chapterId) => {
    try {
      // In a real app: return await api.get(`/chapters/${chapterId}/lessons`);
      return {
        data: [
          {
            lesson_id: 1,
            title: "Bài 1: Giới thiệu khái niệm",
            type: "video",
            duration: "10:15",
            preview: true
          },
          {
            lesson_id: 2,
            title: "Bài 2: Cài đặt môi trường",
            type: "video",
            duration: "12:30",
            preview: false
          },
          {
            lesson_id: 3,
            title: "Bài 3: Bài tập thực hành",
            type: "exercise",
            duration: "20:00",
            preview: false
          }
        ]
      };
    } catch (error) {
      console.error(`Error fetching lessons for chapter ${chapterId}:`, error);
      throw error;
    }
  },
  
  // Enroll in a course
  enrollCourse: async (courseId) => {
    try {
      // In a real app: return await api.post(`/courses/${courseId}/enroll`);
      return {
        data: {
          success: true,
          message: "Đăng ký khóa học thành công",
          enrollment_id: 123
        }
      };
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      throw error;
    }
  },
  
  // Get enrolled courses
  getEnrolledCourses: async () => {
    try {
      // In a real app: return await api.get('/enrollments');
      return {
        data: [
          {
            enrollment_id: 1,
            course_id: 1,
            progress_percent: 60,
            course: {
              title: "Lập Trình JavaScript Cơ Bản",
              thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613"
            }
          },
          {
            enrollment_id: 2,
            course_id: 3,
            progress_percent: 25,
            course: {
              title: "Marketing Số Cho Người Mới Bắt Đầu",
              thumbnail: "https://images.unsplash.com/photo-1557838923-2985c318be48"
            }
          }
        ]
      };
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      throw error;
    }
  }
};

// Auth Service - Methods for authentication
export const authService = {
  // Login
  login: async (credentials) => {
    try {
      // In a real app: return await api.post('/auth/login', credentials);
      return {
        data: {
          token: "sample-jwt-token",
          user: {
            id: 1,
            email: credentials.email,
            full_name: "Nguyễn Văn A",
            role: "user"
          }
        }
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // Register
  register: async (userData) => {
    try {
      // In a real app: return await api.post('/auth/register', userData);
      return {
        data: {
          success: true,
          message: "Đăng ký thành công"
        }
      };
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      // In a real app: return await api.get('/auth/profile');
      return {
        data: {
          id: 1,
          email: "user@example.com",
          full_name: "Nguyễn Văn A",
          phone: "0123456789",
          bio: "Tôi là một người học rất đam mê về công nghệ.",
          avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
          role: "user"
        }
      };
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },
  
  // Update profile
  updateProfile: async (profileData) => {
    try {
      // In a real app: return await api.put('/auth/profile', profileData);
      return {
        data: {
          success: true,
          message: "Cập nhật thông tin thành công"
        }
      };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (passwordData) => {
    try {
      // In a real app: return await api.post('/auth/change-password', passwordData);
      return {
        data: {
          success: true,
          message: "Thay đổi mật khẩu thành công"
        }
      };
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    try {
      // In a real app: return await api.post('/auth/forgot-password', { email });
      return {
        data: {
          success: true,
          message: "Email đặt lại mật khẩu đã được gửi"
        }
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }
};

export default api;
