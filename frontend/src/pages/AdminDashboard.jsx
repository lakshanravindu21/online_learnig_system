import React from 'react';
import {
  Users,
  UserCheck,
  BookOpen,
  DollarSign,
  Menu,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import AdminHeader from '../components/AdminHeader';

const AdminDashboard = () => {
  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 25 },
    { month: 'Apr', value: 45 },
    { month: 'May', value: 40 },
    { month: 'Jun', value: 60 }
  ];

  const recentActivities = [
    {
      activity: "New Student Registration",
      details: "Sophia Clark registered for the 'Data Science Fundamentals' course",
      date: "2024-07-26"
    },
    {
      activity: "Recently Published Course",
      details: "Dr. Ethan Bennett published 'Advanced Machine Learning Techniques'",
      date: "2024-07-25"
    },
    {
      activity: "Latest Enrollment",
      details: "Liam Harper enrolled in 'Web Development Bootcamp'",
      date: "2024-07-24"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white border-r border-gray-200 min-h-screen hidden lg:block">
          <div className="p-6">
            <nav className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium">
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Users size={20} />
                <span>Students</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <UserCheck size={20} />
                <span>Instructors</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <BookOpen size={20} />
                <span>Courses</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <DollarSign size={20} />
                <span>Revenue</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-4 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">1,250</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCheck size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Instructors</p>
                  <p className="text-2xl font-bold text-gray-900">50</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">200</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$50,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
            {/* Monthly Revenue */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-900">$5,000</span>
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium text-green-600">+10%</span>
                </div>
              </div>
              
              {/* Simple Line Chart Visualization */}
              <div className="relative h-48">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 150 Q 80 100 120 130 Q 160 80 200 120 Q 240 60 280 90 Q 320 40 380 30"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 150 Q 80 100 120 130 Q 160 80 200 120 Q 240 60 280 90 Q 320 40 380 30 L 380 200 L 20 200 Z"
                    fill="url(#lineGradient)"
                  />
                </svg>
                {/* Graph Details */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-gray-500">
                  {monthlyData.map((item) => (
                    <div key={item.month} className="flex flex-col items-center">
                      <span>{item.month}</span>
                      <span className="font-semibold text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Growth */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-3xl font-bold text-gray-900">+15%</span>
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium text-green-600">+5%</span>
                </div>
              </div>
              
              {/* Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-2">
                {monthlyData.map((item, index) => (
                  <div key={item.month} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full rounded-t ${index === monthlyData.length - 1 ? 'bg-red-500' : 'bg-red-200'} transition-all`}
                      style={{ height: `${(item.value / 60) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    <span className="font-semibold text-gray-700">{item.value}</span>
                  </div>
                ))}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;