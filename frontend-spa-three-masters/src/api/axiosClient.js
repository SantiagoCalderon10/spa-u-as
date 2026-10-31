import axios from 'axios';

// Instancia global de Axios apuntando al backend Express
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

export default axiosClient;

