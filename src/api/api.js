import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, JWT_COOKIE_NAME } from '../utils/constants';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(JWT_COOKIE_NAME);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
