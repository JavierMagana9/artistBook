import axios from 'axios';

const localApiBaseUrl = import.meta.env.VITE_API_BASE_URL
  || import.meta.env.VITE_API_URL
  || 'http://localhost:5000/api';

const getApiBaseUrl = () => {
  // In production, always call the API through Vercel's same-origin rewrite.
  // This keeps browser requests on artist-book.vercel.app and prevents CORS
  // preflight failures caused by calling the Railway domain directly.
  if (import.meta.env.PROD) {
    return '/api';
  }

  return localApiBaseUrl;
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