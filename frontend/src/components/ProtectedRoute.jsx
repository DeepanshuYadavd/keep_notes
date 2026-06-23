import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

export default ProtectedRoute;
