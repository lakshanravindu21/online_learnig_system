import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import CourseSection from './pages/course';
import AdminCourse from './pages/AdminCourse';
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ManageStudents from './pages/ManageStudents';

// 🔹 Protected Route wrapper
function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/signin" />;
}

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute user={user}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute user={user}>
                <CourseSection />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute user={user}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <PrivateRoute user={user}>
                <AdminCourse />
              </PrivateRoute>
            }
          />
          <Route path="/admin/students" element={<ManageStudents />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
