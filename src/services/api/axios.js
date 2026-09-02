import axios from 'axios';
import config from '@/config';
import storage from '@/utils/storage';
import { getErrorMessage } from '@/utils/errorHandler';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (reqConfig) => {
    const token = storage.getToken();

    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    return reqConfig;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAuth();
      // Redirect to login if not already on login page
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login')
      ) {
        window.location.href = '/login';
      }
    }

    // Attach normalized user-friendly error message to the error object
    error.normalizedMessage = getErrorMessage(error);

    return Promise.reject(error);
  },
);

export default api;
