import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 🔹 Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import CourseSection from './pages/course';
import AdminCourse from './pages/AdminCourse';
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ManageStudents from './pages/ManageStudents';

// 🔹 Config
import { API_BASE } from "./config";

// 🔹 ProtectedRoute import
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from JWT stored in localStorage
  useEffect(() => {
    const fetchUserFromToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user from token:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserFromToken();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute user={user}>
                <CourseSection />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute user={user} role="admin">
                <AdminCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute user={user} role="admin">
                <ManageStudents />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route: redirect based on login and role */}
          <Route
            path="*"
            element={
              user ? (
                user.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
