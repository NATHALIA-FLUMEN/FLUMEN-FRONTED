import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const current = localStorage.getItem('nf_token');
      const isAuthRoute = error.config?.url?.includes('/auth/');
      if (current && !isAuthRoute) {
        localStorage.removeItem('nf_token');
        localStorage.removeItem('nf_user');
      }
    }
    const message = error.response?.data?.message || 'Error de conexión con el servidor';
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  google: (data) => api.post('/auth/google', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data)
};

export const videoService = {
  getAll: (params = {}) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  getFeatured: () => api.get('/videos/featured'),
  getCategories: () => api.get('/categories'),
  getPlayback: (id) => api.get(`/videos/playback/${id}`)
};

export const paymentService = {
  createCheckout: (videoId) => api.post('/payments/checkout', { videoId }),
  confirm: (sessionId) => api.post('/payments/confirm', { sessionId }),
  checkAccess: (videoId) => api.get(`/payments/access/${videoId}`),
  myOrders: () => api.get('/payments/mis-ordenes')
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getVideos: () => api.get('/admin/videos'),
  createVideo: (formData) =>
    api.post('/admin/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateVideo: (id, formData) =>
    api.put(`/admin/videos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteVideo: (id) => api.delete(`/admin/videos/${id}`),
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  setUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getOrders: () => api.get('/admin/orders'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data)
};

export const configService = {
  getConfig: () => api.get('/config')
};

export default api;
