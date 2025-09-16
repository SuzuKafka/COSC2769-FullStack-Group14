import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();

  const buildRedirect = (message) => (
    <Navigate
      to="/login"
      state={{
        from: location,
        message,
      }}
      replace
    />
  );

  if (status === 'idle' || status === 'loading') {
    return <p style={{ padding: '1rem' }}>Checking session...</p>;
  }

  if (!user) {
    return buildRedirect('Please log in to access this page.');
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const expectedRoles = allowedRoles.join(', ');
    return (
      <Navigate
        to="/forbidden"
        state={{ message: `This area requires one of the following roles: ${expectedRoles}.` }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RequireAuth;
