import React from 'react';
import { Home, LogOut } from 'lucide-react';

const Header = ({ user, onLogout, onHome }) => {
  return (
    <header className="bg-blue-800 shadow-sm border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">User Control Panel</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-blue-100">
              Welcome, {user?.name || user?.email || 'User'}
            </span>
            
            <button 
              onClick={onHome}
              className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              title="Go to Dashboard"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </button>
            
            <button 
              onClick={onLogout}
              className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
