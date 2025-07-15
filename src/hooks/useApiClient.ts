// src/hooks/useApiClient.ts

import axios from 'axios';
import { API_URL } from '../config';
import { useAuthStore } from './useAuth';

/**
 * Hook que proporciona una instancia de Axios preconfigurada.
 *
 * Intercepta cada petición para añadir automáticamente el token de autenticación
 * si el usuario está logueado.
 */
const useApiClient = () => {
  const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 segundos de timeout
  });

  // Usamos un interceptor para añadir el token a las cabeceras
  apiClient.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Error en request interceptor:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar errores de respuesta
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Error en response interceptor:', error);
      
      // Solo cerrar sesión si es un error 401 y el usuario está autenticado
      if (error.response?.status === 401 && useAuthStore.getState().isAuthenticated) {
        console.log('Token expirado o inválido, cerrando sesión...');
        useAuthStore.getState().logout();
        // Redirigir a login solo si no estamos ya en una página pública
        if (!window.location.pathname.startsWith('/login') && 
            !window.location.pathname.startsWith('/register') && 
            window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default useApiClient;
