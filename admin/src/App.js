import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CourseManagementDashboard from './pages/CourseManagementDashboard'
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
   <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/CourseManagementDashboard" element={<CourseManagementDashboard />} />
           <Route path="/AdminDashboard" element={<AdminDashboard />} />

           
        </Routes>
          
         
      </div>
    </BrowserRouter>
  )
}

export default App
