
import { Home, LogOut } from "lucide-react";
import React, { useState } from "react";
import {
  Users,
  FileText,
  UserCheck,
  BarChart3,
  PieChart,
  X,
} from "lucide-react";
import StaffManagementFromAdmin from "./StaffManagementFromAdmin";
import UsersManagementFromAdmin from "./UsersManagementFromAdmin";
import AdminDashboard from "./AdminDashboard";
import AdminReports from "./AdminReport";
import ComplaintsManagementFromAdmin from "./ComplaintsManagementFromAdmin";
import { useTheme } from "../../contexts/ThemeContext";

// ✅ Real API service already defined
export const api = {
  baseURL: "http://localhost:8080/api",

  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${api.baseURL}${endpoint}`, config);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Admin endpoints
  getDashboard: () => api.request("/admin/dashboard"),
  getAllUsers: () => api.request("/admin/all-registered-users"),
  addUser: (userData) =>
    api.request("/admin/add-user", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  updateUser: (userId, userData) =>
    api.request(`/admin/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  deleteUser: (userId) =>
    api.request(`/admin/soft-delete/${userId}`, {
      method: "DELETE",
    }),

  // Complaints endpoints
  getAllComplaints: () => api.request("/complaints/all"),
  getComplaintById: (id) => api.request(`/complaints/id/${id}`),
  assignComplaint: (assignmentData) =>
    api.request("/admin/complaints/assign", {
      method: "PUT",
      body: JSON.stringify(assignmentData),
    }),
  updateComplaintStatus: (id, status) =>
    api.request(
      `/assigned-complaints/${id}/admin-update-status?status=${status}`,
      { method: "PUT" }
    ),

  // Reports endpoints
  getAllReports: () => api.request("/reports"),
  createReport: (reportData) =>
    api.request("/reports/create", {
      method: "POST",
      body: JSON.stringify(reportData),
    }),
  downloadReportsPdf: () => api.request("/reports/download-report"),

  // Staff endpoints
  getAllStaff: () => api.request("/admin/staff"),
};

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "complaints", name: "Complaints", icon: FileText },
    { id: "users", name: "Users", icon: Users },
    { id: "staff", name: "Staff", icon: UserCheck },
    { id: "reports", name: "Reports", icon: PieChart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "complaints":
        return <ComplaintsManagementFromAdmin />;
      case "users":
        return <UsersManagementFromAdmin />;
      case "staff":
        return <StaffManagementFromAdmin />;
      case "reports":
        return <AdminReports />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-blue-800 shadow-sm border-b border-blue-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Home className="w-5 h-5" />
                    <span className="hidden sm:inline">Home</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to logout?"))
                        window.location.href = "/login/admin";
                    }}
                    className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

// Root component with theme provider
const ComplaintManagementApp = () => {
  return (
    // <ThemeProvider>
      <App />
    // {/* </ThemeProvider> */}
  );
};

export default ComplaintManagementApp;