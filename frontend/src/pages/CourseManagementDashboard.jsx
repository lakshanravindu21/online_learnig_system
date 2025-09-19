import React, { useState } from 'react';
import {  Plus } from 'lucide-react';
import AddCourseModal from "../components/AddCourseModal"; 
import Sidebar from "../components/SidebarComponent";
import AdminHeader from '../components/AdminHeader';


const CourseManagementDashboard = () => {
  const [approvalRequests, setApprovalRequests] = useState([
    {
      id: '#1221',
      title: 'Data Science Essentials',
      instructor: 'Dr. Liam Walker',
      category: 'Data Science',
      price: '$49.99'
    },
    {
      id: '#4556',
      title: 'Graphic Design Masterclass',
      instructor: 'Ms. Olivia Turner',
      category: 'Design',
      price: '$89.99'
    }
  ]);

  const [openModal, setOpenModal] = useState(false); 

  const courses = [
    {
      id: '#2345',
      title: 'Introduction to Programming',
      instructor: 'Dr. Eleanor Harbor',
      category: 'Computer Science',
      price: '$39.99',
      enrolled: 150
    },
    {
      id: '#9901',
      title: 'Advanced Calculus',
      instructor: 'Prof. Samuel Reinhart',
      category: 'Mathematics',
      price: '$79.99',
      enrolled: 85
    },
    {
      id: '#2840',
      title: 'Creative Writing Workshop',
      instructor: 'Ms. Olivia Carter',
      category: 'Arts & Humanities',
      price: '$29.99',
      enrolled: 200
    },
    {
      id: '#3636',
      title: 'Digital Marketing Fundamentals',
      instructor: 'Mr. Ethan Davis',
      category: 'Business',
      price: '$59.99',
      enrolled: 120
    },
    {
      id: '#9036',
      title: 'Spanish for Beginners',
      instructor: 'Mrs. Isabella Rodriguez',
      category: 'Languages',
      price: '$29.99',
      enrolled: 250
    }
  ];

  const handleApproval = (id, action) => {
    console.log(`${action} course ${id}`);
    // Remove from approval requests after action
    setApprovalRequests(prev => prev.filter(request => request.id !== id));
  };

  return (
    <>
      <AdminHeader />
   
    <div className="flex min-h-screen bg-gray-50">
      
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Courses</h1>
          <button 
            onClick={() => setOpenModal(true)}  // ✅ open modal
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add New Course</span>
          </button>
        </div>

        {/* All Courses Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Courses</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.instructor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{course.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.enrolled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Course Approval Requests Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Approval Requests</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvalRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.instructor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{request.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{request.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleApproval(request.id, 'approve')}
                          className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(request.id, 'reject')}
                          className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {openModal && <AddCourseModal onClose={() => setOpenModal(false)} />}
    </div>
     </>
  );
};

export default CourseManagementDashboard;
