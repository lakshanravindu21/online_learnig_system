import React, { useState } from 'react';
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

const ManageInstructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: 'Dr. Amelia Turner',
      email: 'amelia.turner@email.com',
      totalCourses: 5,
      rating: 4.8,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Prof. Liam Harris',
      email: 'liam.harris@email.com',
      totalCourses: 3,
      rating: 4.5,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Dr. Harper Lewis',
      email: 'harper.lewis@email.com',
      totalCourses: 2,
      rating: 4.2,
      status: 'Blocked'
    },
    {
      id: 4,
      name: 'Prof. Owen Carter',
      email: 'owen.carter@email.com',
      totalCourses: 4,
      rating: 4.7,
      status: 'Active'
    },
    {
      id: 5,
      name: 'Dr. Isabella Reed',
      email: 'isabella.reed@email.com',
      totalCourses: 6,
      rating: 4.9,
      status: 'Active'
    }
  ]);

  // Modal form state
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    email: '',
    totalCourses: '',
    rating: '',
    status: 'Active'
  });

  // Add or Update Instructor
  const handleSaveInstructor = () => {
    if (!newInstructor.name.trim() || !newInstructor.email.trim()) return;

    if (isEditing) {
      setInstructors(
        instructors.map((inst) =>
          inst.id === editId
            ? {
                ...inst,
                ...newInstructor,
                totalCourses: Number(newInstructor.totalCourses) || 0,
                rating: Number(newInstructor.rating) || 0
              }
            : inst
        )
      );
    } else {
      const newEntry = {
        id: instructors.length + 1,
        ...newInstructor,
        totalCourses: Number(newInstructor.totalCourses) || 0,
        rating: Number(newInstructor.rating) || 0
      };
      setInstructors([...instructors, newEntry]);
    }

    // Reset modal
    setNewInstructor({
      name: '',
      email: '',
      totalCourses: '',
      rating: '',
      status: 'Active'
    });
    setIsEditing(false);
    setEditId(null);
    setShowModal(false);
  };

  // Edit
  const handleEdit = (instructor) => {
    setNewInstructor({
      name: instructor.name,
      email: instructor.email,
      totalCourses: instructor.totalCourses,
      rating: instructor.rating,
      status: instructor.status
    });
    setIsEditing(true);
    setEditId(instructor.id);
    setShowModal(true);
  };

  // Delete
  const handleDelete = (id) => {
    setInstructors(instructors.filter((inst) => inst.id !== id));
  };

  // View
  const handleView = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDetails(true);
  };

  // Filtering + search
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'All' || instructor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              Manage Instructors
            </h1>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewInstructor({
                  name: '',
                  email: '',
                  totalCourses: '',
                  rating: '',
                  status: 'Active'
                });
                setShowModal(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Instructor
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
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
            {/* Table Header */}
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

            {/* Table Body */}
            <div className="divide-y divide-gray-100 min-w-[800px]">
              {filteredInstructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* ID */}
                    <div className="col-span-1">
                      <span className="text-sm font-medium text-gray-900">
                        {instructor.id}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-sm">
                            {instructor.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {instructor.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3">
                      <span className="text-sm text-gray-600">
                        {instructor.email}
                      </span>
                    </div>

                    {/* Total Courses */}
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-gray-900">
                        {instructor.totalCourses}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                          {instructor.rating}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          instructor.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {instructor.status}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(instructor)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Eye size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleEdit(instructor)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(instructor.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredInstructors.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No instructors found.
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing {filteredInstructors.length} of {instructors.length} instructors
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
                Previous
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
                2
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Instructor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Instructor' : 'Add New Instructor'}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newInstructor.name}
                onChange={(e) =>
                  setNewInstructor({ ...newInstructor, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newInstructor.email}
                onChange={(e) =>
                  setNewInstructor({ ...newInstructor, email: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Total Courses"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newInstructor.totalCourses}
                onChange={(e) =>
                  setNewInstructor({
                    ...newInstructor,
                    totalCourses: e.target.value
                  })
                }
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newInstructor.rating}
                onChange={(e) =>
                  setNewInstructor({
                    ...newInstructor,
                    rating: e.target.value
                  })
                }
              />
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={newInstructor.status}
                onChange={(e) =>
                  setNewInstructor({ ...newInstructor, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInstructor}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Instructor Details Modal */}
      {showDetails && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Instructor Details</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedInstructor.name}</p>
              <p><strong>Email:</strong> {selectedInstructor.email}</p>
              <p><strong>Total Courses:</strong> {selectedInstructor.totalCourses}</p>
              <p><strong>Rating:</strong> {selectedInstructor.rating}</p>
              <p><strong>Status:</strong> {selectedInstructor.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInstructors;
