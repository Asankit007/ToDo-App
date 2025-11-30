// FILE: src/components/ProtectedRoute.jsx
// UPDATED: Final working ProtectedRoute

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");  // UPDATED

  if (!token) return <Navigate to="/login" replace />; // UPDATED

  return children;
}
