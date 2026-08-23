import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // If auth status is still loading (verifying token), show loading overlay
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-[#FF4422] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-black uppercase tracking-widest text-white/70">
          Verifying Session...
        </p>
      </div>
    );
  }

  // Check if authenticated via backend token OR local session profile exists
  const hasLocalProfile = Boolean(localStorage.getItem("playerProfile"));

  if (!isAuthenticated && !hasLocalProfile) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return children;
}
