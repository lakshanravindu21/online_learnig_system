import React, { useState, useEffect } from "react";
import { X, Edit3, Trash2, PlusCircle } from "lucide-react";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/SidebarComponent";

const categories = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Mathematics" },
  { id: 3, name: "Arts & Humanities" },
  { id: 4, name: "Business" },
  { id: 5, name: "Languages" },
  { id: 6, name: "Data Science" },
  { id: 7, name: "Design" },
  { id: 8, name: "Engineering" },
  { id: 9, name: "Health & Medicine" },
  { id: 10, name: "Personal Development" },
];

export default function AdminCourse() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    title: "",
    instructorId: "",
    categoryId: "",
    description: "",
    price: "",
    enrolledCount: "",
    status: "ACTIVE",
    duration: "",
    lectures: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const token = localStorage.getItem("adminToken") || "";

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  const fetchCourses = async () => {
    if (!token) return;
    try {
      const res = await api.get("/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching courses:", err.response?.data || err.message);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setForm({
        title: course.title,
        instructorId: course.instructorId,
        categoryId: course.categoryId,
        description: course.description,
        price: course.price,
        enrolledCount: course.enrolledCount,
        status: course.status,
        duration: course.duration || "",
        lectures: course.lectures ?? "",
      });
    } else {
      setEditingCourse(null);
      setForm({
        title: "",
        instructorId: "",
        categoryId: "",
        description: "",
        price: "",
        enrolledCount: "",
        status: "ACTIVE",
        duration: "",
        lectures: "",
      });
    }
    setThumbnailFile(null);
    setContentFile(null);
    setMessage({ text: "", type: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setForm({
      title: "",
      instructorId: "",
      categoryId: "",
      description: "",
      price: "",
      enrolledCount: "",
      status: "ACTIVE",
      duration: "",
      lectures: "",
    });
    setThumbnailFile(null);
    setContentFile(null);
    setMessage({ text: "", type: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) setThumbnailFile(file);
  };

  const handleContentUpload = (e) => {
    const file = e.target.files[0];
    if (file) setContentFile(file);
  };

  const showTempMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return showTempMessage("Unauthorized! Please login again.", "error");

    if (!form.title || !form.instructorId || !form.categoryId || !form.price || !form.description) {
      return showTempMessage("Please fill all required fields.", "error");
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", parseFloat(form.price));
    formData.append("categoryId", parseInt(form.categoryId));
    formData.append("status", form.status);
    formData.append("instructorId", parseInt(form.instructorId));
    formData.append("enrolledCount", form.enrolledCount ? parseInt(form.enrolledCount) : 0);

    if (form.duration) formData.append("duration", form.duration);
    if (form.lectures) formData.append("lectures", parseInt(form.lectures));
    if (thumbnailFile) formData.append("thumbnailUrl", thumbnailFile);
    if (contentFile) formData.append("contentUrl", contentFile);

    try {
      setLoading(true);
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        showTempMessage("Course updated successfully!", "success");
      } else {
        await api.post("/courses", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        showTempMessage("Course added successfully!", "success");
      }
      setLoading(false);
      fetchCourses();
      handleCloseModal();
    } catch (err) {
      setLoading(false);
      console.error("Error submitting course:", err.response?.data || err.message);
      showTempMessage(err.response?.data?.error || "Failed to save course.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
      showTempMessage("Course deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting course:", err.response?.data || err.message);
      showTempMessage("Failed to delete course.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-4 lg:p-8">
          {/* Global messages */}
          {message.text && (
            <div
              className={`mb-6 px-5 py-3 rounded-lg font-medium text-center shadow transition-all ${
                message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Courses</h1>
            <button
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg shadow-lg transition"
              onClick={() => handleOpenModal(null)}
            >
              <PlusCircle size={20} /> Add New Course
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold">
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </h2>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    onClick={handleCloseModal}
                  >
                    <X size={22} className="text-gray-600" />
                  </button>
                </div>
                {/* form kept same */}
                <div className="p-6">
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {/* left column */}
                    <div className="space-y-6">
                      <div>
                        <label className="block mb-2 font-medium">Title</label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          required
                          className="w-full border rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full border rounded-lg px-4 py-3 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Price</label>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          value={form.price}
                          onChange={handleChange}
                          required
                          className="w-full border rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Duration</label>
                        <input
                          name="duration"
                          value={form.duration}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Upload Thumbnail</label>
                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} />
                        {thumbnailFile && (
                          <p className="text-sm text-green-600 mt-2">{thumbnailFile.name}</p>
                        )}
                      </div>
                    </div>

                    {/* right column */}
                    <div className="space-y-6">
                      <div>
                        <label className="block mb-2 font-medium">Category</label>
                        <select
                          name="categoryId"
                          value={form.categoryId}
                          onChange={handleChange}
                          required
                          className="w-full border rounded-lg px-4 py-3"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Instructor ID</label>
                        <input
                          name="instructorId"
                          type="number"
                          value={form.instructorId}
                          onChange={handleChange}
                          required
                          className="w-full border rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Enrolled Count</label>
                        <input
                          name="enrolledCount"
                          type="number"
                          min="0"
                          value={form.enrolledCount}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Number of Lectures</label>
                        <input
                          name="lectures"
                          type="number"
                          min="0"
                          value={form.lectures}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Upload Content</label>
                        <input type="file" accept=".pdf,.zip,.mp4" onChange={handleContentUpload} />
                        {contentFile && (
                          <p className="text-sm text-green-600 mt-2">{contentFile.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Status</label>
                        <select
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-4 py-3"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="PENDING">Pending</option>
                          <option value="DRAFT">Draft</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8 col-span-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-3 border rounded-lg text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
                        disabled={loading}
                      >
                        {loading
                          ? editingCourse
                            ? "Updating..."
                            : "Adding..."
                          : editingCourse
                          ? "Update Course"
                          : "Add Course"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">All Courses</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr className="text-gray-600 border-b">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Instructor</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Duration</th>
                    <th className="py-3 px-4 text-left">Lectures</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4 text-gray-500">{c.id}</td>
                        <td className="py-3 px-4 font-medium">{c.title}</td>
                        <td className="py-3 px-4 text-gray-500">{c.instructorId}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {categories.find((cat) => cat.id === c.categoryId)?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-500">${c.price}</td>
                        <td className="py-3 px-4 text-gray-500">{c.duration || "N/A"}</td>
                        <td className="py-3 px-4 text-gray-500">{c.lectures ?? "N/A"}</td>
                        <td className="py-3 px-4 text-gray-500">{c.status}</td>
                        <td className="py-3 px-4 flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleOpenModal(c)}
                            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                            title="Edit"
                          >
                            <Edit3 size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-6 text-center text-gray-500">
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
