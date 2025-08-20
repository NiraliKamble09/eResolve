import React from 'react';
import { User, FileText, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: User
    },
    {
      id: 'complaints',
      label: 'My Complaints',
      icon: FileText
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: Settings
    }
  ];

  return (
    <div className="lg:w-64">
      <nav className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-slate-100 text-slate-800 border-l-4 border-slate-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
