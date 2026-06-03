import React, { createContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  const syncAuth = (payload) => {
    setUser(payload.user);
    localStorage.setItem('user', JSON.stringify(payload.user));
    localStorage.setItem('accessToken', payload.accessToken);
    localStorage.setItem('refreshToken', payload.refreshToken);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    syncAuth(data.data);
    return data.data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    syncAuth(data.data);
    return data.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.dispatchEvent(new Event('auth:logout'));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      })
      .catch(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        window.dispatchEvent(new Event('auth:logout'));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    setUser
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
