import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../../../utils/handleLogin'; // ✅ shared logic

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  //const [user, setUser] = useState(null); // ✅ Add this
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowError(false);
   handleLogin({ email, password }, 'staff', navigate, setShowError);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-semibold text-gray-700 mb-6">
          Staff Login
        </h2>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          {showError && (
            <div
              className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md"
              role="alert"
            >
              Invalid staff credentials or role mismatch
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Staff Email"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Staff Password"
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Staff Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;