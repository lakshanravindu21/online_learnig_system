import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home'; // Import Home
import CourseSection from './pages/course';
import AdminCourse from './pages/AdminCourse';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page route */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
           <Route path="/courses" element={<CourseSection />} />
          <Route path="/admin/courses" element={<AdminCourse />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App