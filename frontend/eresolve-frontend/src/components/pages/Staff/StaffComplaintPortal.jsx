
import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import StaffDashboard from './StaffDashboard';
import StaffComplaints from './StaffComplaints';
import { useTheme } from '../../contexts/ThemeContext';
import { fetchAuthenticatedStaffInfo } from '../../../services/staffService';

const StaffComplaintPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [staffName, setStaffName] = useState('');
  const dashboardDataRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const response = await fetchAuthenticatedStaffInfo();
        setStaffName(response.data.name || 'Staff');
      } catch (err) {
        console.error('Failed to fetch staff info:', err);
        setStaffName('Staff');
      }
    };
    fetchStaffInfo();
  }, []);

  return (
    <div
      className={`min-h-screen flex ${
        isDark ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-800'
      } transition-colors`}
    >
      {/* Sidebar Navigation */}
      <aside
        className={`${
          isDark
            ? 'bg-gray-800 border-r border-gray-700'
            : 'bg-blue-100 border-r border-blue-200'
        } w-64 p-6`}
      >
        <h2 className="text-2xl font-bold mb-6">Staff Panel</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 font-medium w-full text-left px-2 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-800 hover:bg-blue-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center space-x-2 font-medium w-full text-left px-2 py-2 rounded-lg transition-colors ${
              activeTab === 'complaints'
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-800 hover:bg-blue-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Assigned Complaints</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`${
            isDark
              ? 'bg-gray-800 border-b border-gray-700'
              : 'bg-blue-700 border-b border-blue-600'
          } shadow-sm`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-xl font-bold text-white">
                Welcome, {staffName}
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    window.location.href = '/';
                  }}
                  className="p-2 text-blue-50 hover:text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Home</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      localStorage.clear();
                      window.location.href = '/login/staff';
                    }
                  }}
                  className="p-2 text-blue-50 hover:text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded hover:bg-blue-600"
                >
                  {isDark ? (
                    <Sun className="text-yellow-400" />
                  ) : (
                    <Moon className="text-blue-100" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && activeTab === 'dashboard' && (
            <StaffDashboard loadDashboardData={dashboardDataRef} />
          )}
          {!loading && activeTab === 'complaints' && (
            <StaffComplaints loadDashboardDataRef={dashboardDataRef} />
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffComplaintPortal;