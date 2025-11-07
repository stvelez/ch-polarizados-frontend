import axios from 'axios';
import type { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:8080/api';

/**
 * Instancia de Axios configurada con la URL base
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json', 
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
    if (error.response?.status === 401) {
      // Token expirado o no válido
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = axios.create(axiosInstance.defaults);

export default api;
