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
      console.log("Using auth token:", token);
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
  getPapers: () => api.get('papers/'),

  // Generate a new question paper
  generatePaper: async (paperParams) => {
    try {
      const response = await api.post('/papers/generate/', paperParams);
      return response;
    } catch (error) {
      console.error('API Error - Generate Paper:', error);
      throw error;
    }
  },

  // Get a specific paper by ID
  getPaper: async (paperId) => {
    try {
      const response = await api.get(`/papers/${paperId}/`);
      return response;
    } catch (error) {
      console.error('API Error - Get Paper:', error);
      throw error;
    }
  },

  // Get all papers for the current user
  getUserPapers: async () => {
    try {
      const response = await api.get('/papers/user/');
      return response;
    } catch (error) {
      console.error('API Error - Get User Papers:', error);
      throw error;
    }
  },

  downloadPaperPDF: async (paperId) => {
    try {
      const response = await api.get(`papers/${paperId}/download/`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('API Error - Download PDF:', error);
      throw error;
    }
  },

  // ✅ Save updated questions (bulk update)
  updateQuestions: async (questions) => {
    try {
      const response = await api.put('questions/update/', { questions });
      return response.data;
    } catch (error) {
      console.error('API Error - Update Questions:', error);
      throw error;
    }
  }
};

// User services
export const userService = {
  updateProfile: (userData) => api.put('users/profile/', userData),
  updatePreferences: (preferences) => api.put('users/preferences/', preferences),
};
