import axios from 'axios';

const getApiBaseUrl = () => {
  // In production, call the API through Vercel's same-origin rewrite. This
  // avoids browser CORS entirely: the browser talks to artist-book.vercel.app,
  // and Vercel proxies /api/* to the Railway backend server-to-server.
  if (import.meta.env.PROD) {
    return '/api';
  }

  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl()
});

// Interceptor para añadir token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// Mantén esta función para compatibilidad
export { api };

// User API calls
export const getUserProfile = () => {
  return api.get('/users/profile');
};
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