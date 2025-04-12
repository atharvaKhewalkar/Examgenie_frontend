// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/store';

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(AppContext);
  
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;