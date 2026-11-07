import axios from 'axios';
import { leerToken, notificarSesionExpirada } from '../utils/sesion';

// Instancia global de Axios apuntando al backend Express
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // 20 s: el plan gratuito de Render duerme el servicio y el primer request
  // puede tardar ~50 s en despertar. Con 8 s la primera visita fallaba.
  timeout: 20000,
});

// Adjunta el token guardado a cada solicitud. El backend decide si la ruta
// es pública o privada; mandar el token en una ruta pública no molesta.
axiosClient.interceptors.request.use((config) => {
  const token = leerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Un 401 significa que la sesión ya no sirve. Se avisa una sola vez para que
// AuthContext borre el token y RutaPrivada mande al login.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const estado = error.response?.status;
    const esLogin = error.config?.url?.includes('/auth/login');

    if (estado === 401 && !esLogin && leerToken()) {
      notificarSesionExpirada();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
