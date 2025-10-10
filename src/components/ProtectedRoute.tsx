// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // If no token → redirect to signup page
  if (!token) {
    return <Navigate to="/signup" replace />;
  }

  // If token exists → allow access
  return <Outlet />;
};

export default ProtectedRoute;
