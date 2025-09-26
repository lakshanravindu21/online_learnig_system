import React, { useEffect, useState } from 'react'; 
import {
  Users,
  UserCheck,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/SidebarComponent';
import axios from 'axios';

// ✅ Import Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalRevenue: 0,
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Generate last 6 months dynamically
  const getLast6Months = () => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const result = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      result.push(months[d.getMonth()]);
    }
    return result;
  };

  // ✅ Only put actual values into current month, others = 0
  const generateMonthlyData = (total) => {
    const months = getLast6Months();
    const today = new Date();
    return months.map((month, i) => {
      const isCurrentMonth = month === months[months.length - 1]; // last item = current month
      return {
        month,
        value: isCurrentMonth ? total : 0
      };
    });
  };

  const monthlyRevenueData = generateMonthlyData(stats.totalRevenue / 1000); // Scale for visualization
  const monthlyStudentData = generateMonthlyData(stats.totalStudents);

  // Fetch stats & recent activities from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        // Fetch stats
        const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const statsData = statsRes.data;
        setStats({
          totalStudents: statsData.totalStudents ?? 0,
          totalInstructors: statsData.totalInstructors ?? 0,
          totalCourses: statsData.totalCourses ?? 0,
          totalRevenue: statsData.totalRevenue ?? 0,
        });

        // Fetch recent activities
        const activitiesRes = await axios.get('http://localhost:5000/api/dashboard/activities', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentActivities(activitiesRes.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.error || error.message || 'Failed to fetch dashboard data');
        
        setStats({
          totalStudents: 0,
          totalInstructors: 0,
          totalCourses: 0,
          totalRevenue: 0,
        });
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-4 lg:p-8">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading dashboard stats...</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Total Students */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalStudents}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Instructors */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Instructors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalInstructors}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Courses */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalCourses}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : `$${stats.totalRevenue.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
            {/* Monthly Revenue (Line Chart) */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${loading ? '...' : Math.round(stats.totalRevenue).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">This Month</span>
                </div>
              </div>

              {/* ✅ Dynamic Line Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Student Growth (Bar Chart) */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalStudents}
                  </span>
                  <span className="text-sm text-gray-600">New Students</span>
                </div>
              </div>

              {/* ✅ Dynamic Bar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStudentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-6 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.activity}</h4>
                    </div>
                    <div className="lg:col-span-1">
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-4">No recent activities found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

