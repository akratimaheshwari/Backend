import React, { useState } from 'react';
import { Save, ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Failed to update password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
            title="Go back"
          >
            <ArrowLeftCircle className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">RentKart</h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={handlePasswordChange}
          className="bg-white p-8 rounded shadow-md w-full max-w-md border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Change Password
          </h2>

          {message && <div className="mb-4 text-sm text-red-600">{message}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
};


export default ChangePassword;
