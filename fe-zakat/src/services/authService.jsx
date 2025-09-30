import axios from 'axios';

// Base URL untuk API
const API_BASE_URL = 'http://localhost:5000'; // Sesuaikan dengan URL backend Anda

// Buat instance axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, hapus token dan redirect ke login
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  // User Login
  userLogin: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/user/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User Register
  userRegister: async (userData) => {
    try {
      const response = await apiClient.post('/auth/user/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change Password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.patch('/auth/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/user/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset Password
  resetPassword: async (resetData) => {
    try {
      const response = await apiClient.post('/auth/user/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('userToken');
    return !!token;
  },
};

export default authService;