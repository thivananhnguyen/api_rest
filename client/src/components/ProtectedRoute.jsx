import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types'; 

const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (token && userRole === requiredRole) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  requiredRole: PropTypes.string.isRequired,
};

export default ProtectedRoute;
