import React, { useState } from "react";
import { BookOpen, Users, UserCheck, DollarSign, BarChart3 } from "lucide-react";

const initialCourses = [
  {
    id: "#12345",
    title: "Introduction to Programming",
    instructor: "Dr. Eleanor Harper",
    category: "Computer Science",
    price: "$49.99",
    enrolled: 150,
    status: "Active",
  },
  {
    id: "#67890",
    title: "Advanced Calculus",
    instructor: "Prof. Samuel Bennett",
    category: "Mathematics",
    price: "$79.99",
    enrolled: 85,
    status: "Active",
  },
  {
    id: "#24680",
    title: "Creative Writing Workshop",
    instructor: "Ms. Olivia Carter",
    category: "Arts & Humanities",
    price: "$39.99",
    enrolled: 200,
    status: "Pending",
  },
  {
    id: "#13579",
    title: "Digital Marketing Fundamentals",
    instructor: "Mr. Ethan Davis",
    category: "Business",
    price: "$59.99",
    enrolled: 120,
    status: "Draft",
  },
  {
    id: "#98765",
    title: "Spanish for Beginners",
    instructor: "Sra. Isabella Rodriguez",
    category: "Languages",
    price: "$29.99",
    enrolled: 250,
    status: "Active",
  },
];

const approvalRequests = [
  {
    id: "#11223",
    title: "Data Science Essentials",
    instructor: "Dr. Liam Walker",
    category: "Data Science",
    price: "$69.99",
  },
  {
    id: "#44556",
    title: "Graphic Design Masterclass",
    instructor: "Ms. Chloe Turner",
    category: "Design",
    price: "$89.99",
  },
];

export default function AdminCourse() {
  const [courses, setCourses] = useState(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: '',
    title: '',
    instructor: '',
    category: '',
    price: '',
    enrolled: '',
    status: 'Active',
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ id: '', title: '', instructor: '', category: '', price: '', enrolled: '', status: 'Active' });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      ...form,
      id: `#${Math.floor(Math.random() * 90000) + 10000}`,
      enrolled: Number(form.enrolled),
    };
    setCourses([newCourse, ...courses]);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-lg font-bold text-gray-800">EduPlatform</span>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Users size={20} />
            <span>Students</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <UserCheck size={20} />
            <span>Instructors</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 rounded-lg font-medium">
            <BookOpen size={20} />
            <span>Courses</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <DollarSign size={20} />
            <span>Revenue</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
            <span className="sr-only">Notifications</span>
            <svg width="24" height="24" fill="none" className="text-gray-500"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        </header>

        {/* Page Title and Add Button */}
        <div className="flex items-center justify-between px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md shadow transition"
            onClick={handleOpenModal}
          >
            <span className="text-xl">+</span> Add New Course
          </button>
      {/* Modal for Add Course */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Title" className="w-full border rounded px-3 py-2" />
              <input name="instructor" value={form.instructor} onChange={handleChange} required placeholder="Instructor" className="w-full border rounded px-3 py-2" />
              <input name="category" value={form.category} onChange={handleChange} required placeholder="Category" className="w-full border rounded px-3 py-2" />
              <input name="price" value={form.price} onChange={handleChange} required placeholder="Price (e.g. $49.99)" className="w-full border rounded px-3 py-2" />
              <input name="enrolled" value={form.enrolled} onChange={handleChange} required placeholder="Enrolled" type="number" min="0" className="w-full border rounded px-3 py-2" />
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
              </select>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded">Add Course</button>
            </form>
          </div>
        </div>
      )}
        </div>

        {/* All Courses Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 mx-8 mb-8 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All Courses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 font-semibold border-b">
                  <th className="py-3 px-4 text-left">Course ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Instructor</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Enrolled</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-3 px-4 text-gray-500">{c.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{c.title}</td>
                    <td className="py-3 px-4 text-gray-500">{c.instructor}</td>
                    <td className="py-3 px-4 text-gray-500">{c.category}</td>
                    <td className="py-3 px-4 text-gray-500">{c.price}</td>
                    <td className="py-3 px-4 text-gray-500">{c.enrolled}</td>
                    <td className="py-3 px-4">
                      {c.status === "Active" && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                      )}
                      {c.status === "Pending" && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                      )}
                      {c.status === "Draft" && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Draft</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Approval Requests Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 mx-8 mb-8 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Course Approval Requests</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 font-semibold border-b">
                  <th className="py-3 px-4 text-left">Course ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Instructor</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvalRequests.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-3 px-4 text-gray-500">{r.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{r.title}</td>
                    <td className="py-3 px-4 text-gray-500">{r.instructor}</td>
                    <td className="py-3 px-4 text-gray-500">{r.category}</td>
                    <td className="py-3 px-4 text-gray-500">{r.price}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button className="bg-green-100 text-green-700 px-4 py-1 rounded-md font-semibold hover:bg-green-200 transition">Approve</button>
                      <button className="bg-red-100 text-red-700 px-4 py-1 rounded-md font-semibold hover:bg-red-200 transition">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}