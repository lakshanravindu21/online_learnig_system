
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AboutUs from './pages/AboutUs';


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/about" element={<AboutUs />} />
        </Routes>
          
         
      </div>
    </BrowserRouter>
  )
}

export default App
