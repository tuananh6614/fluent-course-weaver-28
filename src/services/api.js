
import axios from 'axios';

// Base API URL - pointing to your local XAMPP server
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
      // Instead of mock data, use the actual API
      return await api.get('/courses');
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },
  
  // Get course by id
  getCourseById: async (id) => {
    try {
      return await api.get(`/courses/${id}`);
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
  
  // Get chapter lessons
  getChapterLessons: async (chapterId) => {
    try {
      return await api.get(`/chapters/${chapterId}/lessons`);
    } catch (error) {
      console.error(`Error fetching lessons for chapter ${chapterId}:`, error);
      throw error;
    }
  },
  
  // Enroll in a course
  enrollCourse: async (courseId) => {
    try {
      return await api.post(`/courses/${courseId}/enroll`);
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      throw error;
    }
  },
  
  // Get enrolled courses
  getEnrolledCourses: async () => {
    try {
      return await api.get('/enrollments');
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
      return await api.post('/auth/login', credentials);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // Register
  register: async (userData) => {
    try {
      // Use the real API endpoint for registration
      return await api.post('/auth/register', userData);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      return await api.get('/auth/profile');
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },
  
  // Update profile
  updateProfile: async (profileData) => {
    try {
      return await api.put('/auth/profile', profileData);
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (passwordData) => {
    try {
      return await api.post('/auth/change-password', passwordData);
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },
  
  // Forgot password
  forgotPassword: async (email) => {
    try {
      return await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }
};

export default api;
