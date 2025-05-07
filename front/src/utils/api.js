import axios from 'axios';
import { getAuth } from 'firebase/auth';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL
});

// Interceptor para incluir el token en TODAS las peticiones
api.interceptors.request.use(async (config) => {
  console.log('Interceptor ejecutándose para URL:', config.url);
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      console.log('Token obtenido (primeros 20 caracteres):', token.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('⚠️ No hay usuario autenticado');
    }
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.message);
  }
  return config;
});

export default api;

// Mantén esta función para compatibilidad
export const setAuthToken = () => {
  // Esta función ya no necesita hacer nada, el interceptor se encarga
  // de incluir el token en todas las peticiones
};

// User API calls
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);
export const getAllUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Entry API calls
export const getEntries = () => api.get('/entries');
export const getUserEntries = () => api.get('/entries/user-entries');
export const getEntry = (id) => api.get(`/entries/${id}`);
export const createEntry = (data) => api.post('/entries', data);
export const updateEntry = (id, data) => api.put(`/entries/${id}`, data);
export const deleteEntry = (id) => api.delete(`/entries/${id}`);