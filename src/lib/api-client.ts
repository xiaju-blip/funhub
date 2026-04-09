import axios from 'axios';

// Use environment variable if provided
// In production on Railway with different subdomains:
// frontend: https://reelrwa-frontend-production-da83.up.railway.app
// backend: https://reelrwa-backend-production.up.railway.app
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Detect Railway frontend domain -> auto-detect backend domain
  if (window.location.hostname.includes('railway.app')) {
    // Replace frontend- prefix with backend-
    const backendHost = window.location.hostname.replace(/frontend-([^.-]+)-/, 'backend-$1-');
    return `${window.location.protocol}//${backendHost}`;
  }
  
  // Local development
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
