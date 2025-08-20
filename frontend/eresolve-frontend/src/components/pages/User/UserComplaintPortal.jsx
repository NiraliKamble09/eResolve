import React, { useState, useEffect } from 'react';
import {
  User, FileText, Settings, LogOut, Home
} from 'lucide-react';
import UserComplaints from './UserComplaints';
import UserAccountSetting from './UserAccountSetting';
import UserDashboard from './UserDashboard';
import { userService } from '../../../services/userService';

const UserControlPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch authenticated user from backend
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await userService.fetchAuthenticatedUserInfo();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear session/token
      // localStorage.removeItem('token');
      window.location.href = '/login/user';
    }
  };

  const handleHome = () => {
    setActiveTab('dashboard');
    window.location.href = '/';
  };

  if (loading || !user) {
    return <div className="p-6 text-slate-600">Loading user control panel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 shadow-sm border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">User Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-blue-100">Welcome, {user.name}</span>
              <button
                onClick={handleHome}
                className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-100 text-slate-800 border-l-4 border-slate-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeTab === 'complaints'
                      ? 'bg-slate-100 text-slate-800 border-l-4 border-slate-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  My Complaints
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeTab === 'settings'
                      ? 'bg-slate-100 text-slate-800 border-l-4 border-slate-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Account Settings
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && <UserDashboard user={user} />}
            {activeTab === 'complaints' && <UserComplaints user={user} />}
            {activeTab === 'settings' && <UserAccountSetting user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserControlPanel;