import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ role = 'user' }) => {
  const token = role === 'admin' 
    ? localStorage.getItem('bis_admin_token') 
    : localStorage.getItem('bis_user_token');

  if (!token) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
