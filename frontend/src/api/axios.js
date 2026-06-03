import axios from 'axios';

// ✅ FIX: stable base URL for all environments
const BASE =
  (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

const api = axios.create({
  baseURL: BASE
});

export const assetBaseUrl = BASE.replace(/\/api\/v1\/?$/, '');

// attach access token
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
        // ✅ FIX: use stable BASE instead of api.defaults.baseURL
        const { data } = await axios.post(`${BASE}/auth/refresh`, {
          refreshToken
        });

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
