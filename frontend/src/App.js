
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Header from "./components/Header"; 
import Footer from "./components/Footer";


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
          
         
      </div>
    </BrowserRouter>
  )
}

export default App
