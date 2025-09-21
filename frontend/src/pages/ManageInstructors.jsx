import React, { useState, useEffect } from 'react'; 
import {
  Plus,
  Eye,
  Star,
  Search,
  Filter,
  X,
  Edit,
  Trash
} from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/SidebarComponent';
import axios from 'axios';

const ManageInstructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const [newInstructor, setNewInstructor] = useState({
    name: '',
    email: '',
    rating: '',
    status: 'Active'
  });

  const token = localStorage.getItem('token');

  // Fetch all instructors and their course counts
  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/instructors', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const instructorsWithCourses = await Promise.all(
        res.data.map(async (inst) => {
          try {
            const coursesRes = await axios.get(
              `http://localhost:5000/api/instructors/${inst.id}/courses`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...inst, totalCourses: coursesRes.data.length };
          } catch {
            return { ...inst, totalCourses: 0 };
          }
        })
      );

      setInstructors(instructorsWithCourses);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Toast handler
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 1500); // Toast disappears after 1.5s
  };

  // Add / Update Instructor
  const handleSaveInstructor = async () => {
    if (!newInstructor.name.trim() || !newInstructor.email.trim()) return;

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/instructors/${editId}`,
          { ...newInstructor },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Instructor updated successfully');
      } else {
        await axios.post(
          'http://localhost:5000/api/instructors',
          { ...newInstructor },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Instructor added successfully');
      }

      // Reset form
      setNewInstructor({ name: '', email: '', rating: '', status: 'Active' });
      setIsEditing(false);
      setEditId(null);

      // Refresh instructor list from backend to reflect latest data
      await fetchInstructors();

      // Close modal after short delay to allow toast to show
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      console.error('Error saving instructor:', err);
    }
  };

  // Edit Instructor
  const handleEdit = (instructor) => {
    setNewInstructor({
      name: instructor.name,
      email: instructor.email,
      rating: instructor.rating,
      status: instructor.status
    });
    setIsEditing(true);
    setEditId(instructor.id);
    setShowModal(true);
  };

  // Delete Instructor
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/instructors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Instructor deleted successfully');
      await fetchInstructors();
    } catch (err) {
      console.error('Error deleting instructor:', err);
    }
  };

  // View Instructor
  const handleView = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDetails(true);
  };

  // Filtering + Search
  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inst.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inst.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Manage Instructors</h1>
            <button
              onClick={() => { setIsEditing(false); setNewInstructor({ name: '', email: '', rating: '', status: 'Active' }); setShowModal(true); }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} /> Add New Instructor
            </button>
          </div>

          {/* Search + Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search instructors..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="relative">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
              </div>
            </div>
          </div>

          {/* Instructors Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 min-w-[800px]">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 uppercase tracking-wide">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">NAME</div>
                <div className="col-span-3">EMAIL</div>
                <div className="col-span-2">TOTAL COURSES</div>
                <div className="col-span-1">RATING</div>
                <div className="col-span-1">STATUS</div>
                <div className="col-span-1">ACTION</div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 min-w-[800px]">
              {filteredInstructors.map(inst => (
                <div key={inst.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm font-medium text-gray-900">{inst.id}</div>
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-sm">{inst.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{inst.name}</p>
                    </div>
                    <div className="col-span-3 text-sm text-gray-600">{inst.email}</div>
                    <div className="col-span-2 text-sm font-medium text-gray-900">{inst.totalCourses}</div>
                    <div className="col-span-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{inst.rating}</span>
                    </div>
                    <div className="col-span-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inst.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{inst.status}</span>
                    </div>
                    <div className="col-span-1 flex items-center gap-2">
                      <button onClick={() => handleView(inst)} className="p-1 hover:bg-gray-100 rounded transition-colors"><Eye size={16} className="text-gray-400" /></button>
                      <button onClick={() => handleEdit(inst)} className="p-1 hover:bg-gray-100 rounded transition-colors"><Edit size={16} className="text-gray-400" /></button>
                      <button onClick={() => handleDelete(inst.id)} className="p-1 hover:bg-gray-100 rounded transition-colors"><Trash size={16} className="text-red-400" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredInstructors.length === 0 && (
                <div className="p-6 text-center text-gray-500">No instructors found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity">
          {toastMessage}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Instructor' : 'Add New Instructor'}</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                className="border px-3 py-2 rounded-lg w-full"
                value={newInstructor.name}
                onChange={e => setNewInstructor({ ...newInstructor, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="border px-3 py-2 rounded-lg w-full"
                value={newInstructor.email}
                onChange={e => setNewInstructor({ ...newInstructor, email: e.target.value })}
              />
              <input
                type="number"
                placeholder="Rating"
                className="border px-3 py-2 rounded-lg w-full"
                value={newInstructor.rating}
                onChange={e => setNewInstructor({ ...newInstructor, rating: e.target.value })}
              />
              <select
                className="border px-3 py-2 rounded-lg w-full"
                value={newInstructor.status}
                onChange={e => setNewInstructor({ ...newInstructor, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
              <button
                onClick={handleSaveInstructor}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-2"
              >
                {isEditing ? 'Update Instructor' : 'Add Instructor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && selectedInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Instructor Details</h2>
            <p><strong>ID:</strong> {selectedInstructor.id}</p>
            <p><strong>Name:</strong> {selectedInstructor.name}</p>
            <p><strong>Email:</strong> {selectedInstructor.email}</p>
            <p><strong>Total Courses:</strong> {selectedInstructor.totalCourses}</p>
            <p><strong>Rating:</strong> {selectedInstructor.rating}</p>
            <p><strong>Status:</strong> {selectedInstructor.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInstructors;
