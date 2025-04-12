// src/services/api.js
import axios from 'axios';

// Change this to your actual backend URL when deployed
const API_URL = 'http://localhost:8000/api/';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: (credentials) => api.post('auth/login/', credentials),
  register: (userData) => api.post('auth/register/', userData),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// Question services
export const questionService = {
  uploadQuestionBank: (formData) => {
    return api.post('questions/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getQuestions: () => api.get('questions/'),
  generatePaper: (params) => api.post('papers/generate/', params),
  getPapers: () => api.get('papers/'),
};

// User services
export const userService = {
  updateProfile: (userData) => api.put('users/profile/', userData),
  updatePreferences: (preferences) => api.put('users/preferences/', preferences),
};