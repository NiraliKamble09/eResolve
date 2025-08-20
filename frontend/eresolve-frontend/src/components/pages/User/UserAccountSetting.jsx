

import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

const UserAccountSetting = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState('Active');

  // ✅ Fetch authenticated user from backend
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await userService.fetchAuthenticatedUserInfo();
        setUser(response.data);
        setAccountStatus(response.data.status || 'Active');
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleDeactivateAccount = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to deactivate your account?')) {
      try {
        await userService.deactivateOwnAccount(user.userId);
        setAccountStatus('Deactivated');
        alert('Account deactivated successfully');
      } catch (error) {
        console.error('Error deactivating account:', error);
        alert('Failed to deactivate account');
      }
    }
  };

  const handleReactivateAccount = async () => {
    if (!user) return;
    if (window.confirm('Do you want to reactivate your account?')) {
      try {
        await userService.reactivateOwnAccount(user.userId);
        setAccountStatus('Active');
        alert('Account reactivated successfully');
      } catch (error) {
        console.error('Error reactivating account:', error);
        alert('Failed to reactivate account');
      }
    }
  };

  if (loading || !user) {
    return <div className="p-6 text-slate-600">Loading account settings...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Account Settings</h2>

      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Full Name</p>
                <p className="text-slate-800 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Email Address</p>
                <p className="text-slate-800 font-medium">{user.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600">User ID</p>
                <p className="text-slate-800 font-medium">{user.userId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Account Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    accountStatus === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {accountStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Account Actions</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDeactivateAccount}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Deactivate Account
            </button>

            <button
              onClick={handleReactivateAccount}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Reactivate Account
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Deactivating your account will disable access until reactivation.
              Reactivation will generate a temporary password sent to your registered email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountSetting;