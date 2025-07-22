// src/config/index.ts

/**
 * URL base de la API del backend.
 * Se configura automáticamente según el entorno.
 */
const getApiUrl = (): string => {
  // En desarrollo, usar localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api';
  }
  
  // En producción/Docker, usar variable de entorno o detectar automáticamente
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback: usar la IP del host actual con puerto 8000
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Si estamos en localhost, asumir que el backend está en el mismo host
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // En Docker/producción, usar el hostname actual con puerto 8000
  return `${protocol}//${hostname}:8000/api`;
};

export const API_URL = getApiUrl();

// Para debugging
console.log('🔗 API URL configurada:', API_URL);

