import axios from 'axios';
import { useToast } from '@/composables/useToast';
import router from '@/router';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { showToast } = useToast();

    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          router.push('/login');
          showToast('Session expired. Please login again.', 'error');
          break;
        case 429:
          showToast('Too many requests. Please try again later.', 'error');
          break;
        default:
          showToast(
            error.response.data.message || 'An error occurred',
            'error'
          );
      }
    } else {
      showToast('Network error. Please check your connection.', 'error');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 