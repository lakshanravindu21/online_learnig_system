import React, { useState, useEffect } from 'react'; 
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/SidebarComponent';

const ManageStudents = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    contact: '',
    status: 'Active'
  });

  const API_BASE = "http://localhost:5000/api";

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/students`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setStudents([]);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const filteredStudents = Array.isArray(students)
    ? students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSaveStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.contact) return;

    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        const res = await fetch(`${API_BASE}/students/${editId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newStudent),
        });
        if (!res.ok) throw new Error("Failed to update student");
        await loadStudents();
      } else {
        const res = await fetch(`${API_BASE}/students`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newStudent),
        });
        if (!res.ok) throw new Error("Failed to add student");
        await loadStudents();
      }

      setNewStudent({ name: '', email: '', contact: '', status: 'Active' });
      setIsEditing(false);
      setEditId(null);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent({
      name: student.name,
      email: student.email,
      contact: student.contact,
      status: student.status
    });
    setIsEditing(true);
    setEditId(student._id || student.id);
    setShowAddModal(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/students/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      setStudents(students.filter(student => (student._id || student.id) !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Manage Students</h1>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewStudent({ name: '', email: '', contact: '', status: 'Active' });
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={20} />
                Add New Student
              </button>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map(student => (
                    <tr key={student._id || student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student._id || student.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {Array.isArray(student.enrolledCourses) ? student.enrolledCourses.join(', ') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student._id || student.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal (no enrolled courses) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{isEditing ? 'Edit Student' : 'Add Student'}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter student name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter email address" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input type="text" value={newStudent.contact} onChange={(e) => setNewStudent({...newStudent, contact: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Enter contact number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={newStudent.status} onChange={(e) => setNewStudent({...newStudent, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveStudent} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{isEditing ? 'Update' : 'Add Student'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal (no enrolled courses) */}
      {showDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative p-6">
            <button onClick={() => setShowDetails(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-xl">
                {selectedStudent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <p className="text-lg font-medium">{selectedStudent.name}</p>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Contact:</strong> {selectedStudent.contact}</p>
              <p><strong>Status:</strong> {selectedStudent.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
