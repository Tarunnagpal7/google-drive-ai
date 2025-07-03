// src/components/ProtectedRoute.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import React from 'react'; // Add this import

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  if (!isAuthenticated && !token) {
    return React.createElement(Navigate, { to: "/", replace: true });
  }

  return children;
};

export default ProtectedRoute;