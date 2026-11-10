import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This component "wraps" pages that should ONLY be visible to logged-in
// students, e.g. Dashboard, Profile, Skills, Resume, Careers.
// If there is no logged-in user, it redirects to the login page instead.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
