import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user } = useAuth();

  return user && user.role === requiredRole ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

// ProtectedRoute.js
/* import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute; */
