import React from "react";
import { NavLink } from "react-router-dom";
import { Users, BookOpen, DollarSign, BarChart3 } from "lucide-react";

const SidebarComponent = () => {
  const linkClasses =
    "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer";
  const activeClasses = "text-red-600 bg-red-50";
  const inactiveClasses = "text-gray-600 hover:bg-gray-50";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <nav className="space-y-1">
            <NavLink
              to="/AdminDashboard"
              end
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/students"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <Users size={20} />
              <span>Students</span>
            </NavLink>

            <NavLink
              to="/instructors"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <Users size={20} />
              <span>Instructors</span>
            </NavLink>

            <NavLink
              to="/CourseManagementDashboard"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </NavLink>

            <NavLink
              to="/revenue"
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
              }
            >
              <DollarSign size={20} />
              <span>Revenue</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
