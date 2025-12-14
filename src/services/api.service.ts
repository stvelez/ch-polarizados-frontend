import axios from 'axios';
import type { AxiosInstance } from 'axios';

const BASE_URL = 'http://localhost:4000/api';

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
    console.log('🔄 Interceptando solicitud...',token);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token enviado:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.error('❌ NO HAY TOKEN EN LOCALSTORAGE - Debes hacer login primero');
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
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Exportar la instancia configurada con los interceptores
export const api = axiosInstance;

export default axiosInstance;
