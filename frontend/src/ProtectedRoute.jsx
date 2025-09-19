import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // 🔹 Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🔹 1️⃣ Not logged in -> redirect to /signin
  if (!currentUser) return <Navigate to="/signin" replace />;

  // 🔹 2️⃣ Role-based protection -> if role prop exists and doesn't match, redirect
  if (role && currentUser.role !== role) {
    // Redirect admin users trying to access user pages to /admin/dashboard
    if (currentUser.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    // Redirect normal users trying to access admin pages to home
    return <Navigate to="/" replace />;
  }

  // 🔹 3️⃣ If logged in and role matches (or no role specified), render children
  return children;
}
