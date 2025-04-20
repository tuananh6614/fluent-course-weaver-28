
import axios from 'axios';
import { toast } from "sonner";

// Base API URL with fallback - try to connect to backend server first, fallback to mock data if needed
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a longer timeout to prevent quick failures
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear invalid credentials if the error is authentication related
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        toast.error('Phiên đăng nhập đã hết hạn', {
          description: 'Vui lòng đăng nhập lại để tiếp tục'
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    
    const message = 
      error.response?.data?.message || 
      'Đã xảy ra lỗi. Vui lòng thử lại sau.';
    
    toast.error('Lỗi', {
      description: message,
    });
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  
  register: async (full_name: string, email: string, password: string) => {
    const response = await api.post('/register', { full_name, email, password });
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/verify-token');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: { full_name: string, phone?: string, bio?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string, newPassword: string }) => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },
};

// Course services
export const courseService = {
  getAllCourses: async () => {
    try {
      console.log("Fetching all courses...");
      const response = await api.get('/courses');
      console.log("Courses fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all courses:", error);
      // Return empty data structure to prevent errors
      return { success: false, count: 0, data: [] };
    }
  },
  
  getCourseById: async (id: string | number) => {
    try {
      console.log(`Fetching course with ID: ${id}`);
      const response = await api.get(`/courses/${id}`);
      console.log("Course detail fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      // Return empty data structure to prevent errors
      return { success: false, data: { chapters: [] } };
    }
  },
  
  createCourse: async (courseData: { title: string, description?: string, thumbnail?: string }) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },
  
  enrollCourse: async (courseId: string | number) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },
  
  getEnrolledCourses: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },
  
  getChapterLessons: async (chapterId: string | number) => {
    const response = await api.get(`/chapters/${chapterId}/lessons`);
    return response.data;
  },

  getLesson: async (lessonId: string | number) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  updateProgress: async (courseId: string | number, data: { progress_percent: number, current_lesson_id?: number }) => {
    const response = await api.put(`/enrollments/${courseId}/progress`, data);
    return response.data;
  },
};

// Certificate services
export const certificateService = {
  getCertificate: async (id: string | number) => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
  },

  generateCertificate: async (courseId: string | number) => {
    const response = await api.post(`/certificates/generate/${courseId}`);
    return response.data;
  },

  verifyCertificate: async (certificateNumber: string) => {
    const response = await api.get(`/certificates/verify/${certificateNumber}`);
    return response.data;
  },
};

// Exam services
export const examService = {
  getCourseExams: async (courseId: string | number) => {
    const response = await api.get(`/courses/${courseId}/exams`);
    return response.data;
  },

  getExam: async (examId: string | number) => {
    const response = await api.get(`/exams/${examId}`);
    return response.data;
  },

  submitExam: async (examId: string | number, answers: Array<{question_id: number, selected_option: string}>) => {
    const response = await api.post(`/exams/${examId}/submit`, { answers });
    return response.data;
  },
};

export default api;
