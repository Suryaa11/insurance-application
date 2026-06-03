import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Loader fullscreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/customer'} replace />;
  }

  return children;
}
