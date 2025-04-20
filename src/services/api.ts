
import axios from 'axios';
import { toast } from "sonner";

// Base API URL - pointing to your local XAMPP server
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    
    if (error.response?.status === 401) {
      // Clear invalid credentials
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

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: { full_name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/auth/verify-token');
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
      return { success: false, count: 0, data: [] };
    }
  },
  
  getCourseById: async (id: string | number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  enrollCourse: async (courseId: string | number) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },
  
  getEnrolledCourses: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  }
};

export default api;
