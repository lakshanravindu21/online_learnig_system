import React, { useState } from "react";
import { BookOpen, Users, UserCheck, DollarSign, BarChart3, Bell, Upload, X } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/SidebarComponent";

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

const categories = [
  "Computer Science",
  "Mathematics", 
  "Arts & Humanities",
  "Business",
  "Languages",
  "Data Science",
  "Design",
  "Engineering",
  "Health & Medicine",
  "Personal Development"
];

export default function AdminCourse() {
  const [courses, setCourses] = useState(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    instructor: "",
    category: "",
    description: "",
    price: "",
    enrolled: "",
    status: "Active",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({
      id: "",
      title: "",
      instructor: "",
      category: "",
      description: "",
      price: "",
      enrolled: "",
      status: "Active",
    });
    setThumbnailFile(null);
    setContentFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const handleContentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContentFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCourse = {
      ...form,
      id: `#${Math.floor(Math.random() * 90000) + 10000}`,
      enrolled: Number(form.enrolled) || 0,
    };
    setCourses([newCourse, ...courses]);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-4 lg:p-8">
          {/* Page Title and Add Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <button
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md shadow transition"
              onClick={handleOpenModal}
            >
              <span className="text-xl">+</span> Add New Course
            </button>
          </div>

          {/* Enhanced Modal for Add Course */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="Enter course title"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Enter course description"
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Upload Thumbnail */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Thumbnail
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition">
                          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                          <div className="mb-2">
                            <label className="cursor-pointer">
                              <span className="text-red-600 font-medium hover:text-red-700">
                                Upload a file
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-gray-500"> or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                          {thumbnailFile && (
                            <p className="text-sm text-green-600 mt-2">
                              Selected: {thumbnailFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Instructor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instructor
                        </label>
                        <input
                          name="instructor"
                          value={form.instructor}
                          onChange={handleChange}
                          placeholder="Enter instructor name"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      {/* Initial Enrolled Count */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Initial Enrolled Count
                        </label>
                        <input
                          name="enrolled"
                          value={form.enrolled}
                          onChange={handleChange}
                          placeholder="0"
                          type="number"
                          min="0"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      {/* Upload Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Content
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition">
                          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                          <div className="mb-2">
                            <label className="cursor-pointer">
                              <span className="text-red-600 font-medium hover:text-red-700">
                                Upload a file
                              </span>
                              <input
                                type="file"
                                accept=".pdf,.zip,.mp4,.docx"
                                onChange={handleContentUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-gray-500"> or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-400">PDF, ZIP, MP4 up to 1GB</p>
                          {contentFile && (
                            <p className="text-sm text-green-600 mt-2">
                              Selected: {contentFile.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition bg-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-md"
                    >
                      Add Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Courses Table */}
          <div className="bg-white rounded-xl shadow border border-gray-100 mb-8 p-6">
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
                  {courses.map((c, idx) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3 px-4 text-gray-500">{c.id}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{c.title}</td>
                      <td className="py-3 px-4 text-gray-500">{c.instructor}</td>
                      <td className="py-3 px-4 text-gray-500">{c.category}</td>
                      <td className="py-3 px-4 text-gray-500">{c.price}</td>
                      <td className="py-3 px-4 text-gray-500">{c.enrolled}</td>
                      <td className="py-3 px-4">
                        <select
                          value={c.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setCourses((prev) =>
                              prev.map((course, i) =>
                                i === idx ? { ...course, status: newStatus } : course
                              )
                            );
                          }}
                          className={
                            "rounded-full px-3 py-1 text-xs font-semibold " +
                            (c.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : c.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700")
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Course Approval Requests Table */}
          <div className="bg-white rounded-xl shadow border border-gray-100 mb-8 p-6">
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
                        <button className="bg-green-100 text-green-700 px-4 py-1 rounded-md font-semibold hover:bg-green-200 transition">
                          Approve
                        </button>
                        <button className="bg-red-100 text-red-700 px-4 py-1 rounded-md font-semibold hover:bg-red-200 transition">
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
    </div>
  );
}