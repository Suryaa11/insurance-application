import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
});

export const assetBaseUrl = (api.defaults.baseURL || '').replace(/\/api\/v1\/?$/, '');

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = false;
let waiters = [];

function notifyWaiters(error, token = null) {
  waiters.forEach((waiter) => {
    if (error) {
      waiter.reject(error);
    } else {
      waiter.resolve(token);
    }
  });
  waiters = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }

      if (refreshing) {
        return new Promise((resolve, reject) => {
          waiters.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      refreshing = true;
      try {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        notifyWaiters(null, data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        notifyWaiters(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
