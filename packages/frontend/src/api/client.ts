import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle errors
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);