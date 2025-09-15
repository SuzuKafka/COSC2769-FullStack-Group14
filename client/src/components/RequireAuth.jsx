import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <p style={{ padding: '1rem' }}>Checking session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ message: 'Access denied for this area.' }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
