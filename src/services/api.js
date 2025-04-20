
import axios from 'axios';
import { toast } from 'sonner';

// Base API URL - pointing to your local XAMPP server
const API_URL = 'http://localhost:5000/api';

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to match api.ts
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
    console.error('API Error:', error);
    
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      toast.error('Phiên đăng nhập đã hết hạn', {
        description: 'Vui lòng đăng nhập lại để tiếp tục'
      });
      
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
      console.log("Fetching all courses...");
      const response = await api.get('/courses');
      console.log("Courses fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return { success: false, count: 0, data: [] };
    }
  },
  
  // Get course by id
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
  
  // Get chapter lessons
  getChapterLessons: async (chapterId) => {
    try {
      const response = await api.get(`/chapters/${chapterId}/lessons`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lessons for chapter ${chapterId}:`, error);
      throw error;
    }
  },
  
  // Enroll in a course
  enrollCourse: async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      throw error;
    }
  },
  
  // Get enrolled courses
  getEnrolledCourses: async () => {
    try {
      const response = await api.get('/enrollments');
      return response.data;
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      throw error;
    }
  },
  
  // Create a new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },
  
  // Update course
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${courseId}:`, error);
      throw error;
    }
  },
  
  // Delete course
  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting course ${courseId}:`, error);
      throw error;
    }
  }
};

// Auth Service - Methods for authentication
export const authService = {
  // Login
  login: async (email, password) => {
    try {
      console.log("Attempting login with:", { email, password: '****' });
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // Register
  register: async (userData) => {
    try {
      console.log("Attempting registration with:", userData);
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },
  
  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify-token');
      return response.data;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },
  
  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }
};

export default api;
