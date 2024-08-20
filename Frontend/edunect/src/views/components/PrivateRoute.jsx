import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLogin } from '../../required_context/LoginContext.jsx';

const PrivateRoute = () => {
  const { isLoggedIn } = useLogin();

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
