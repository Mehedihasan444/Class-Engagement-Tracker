/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { User, Lock, Mail, BookOpen, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import { useAuthStore } from '../stores/authStore';

export default function Profile() {
  const { student, login } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    classSection: student?.classSection || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.patch('/auth/me', formData);
      login(data.student, data.token);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await api.patch('/auth/update-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Password update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <User className="h-6 w-6 mr-2 text-indigo-500" />
          My Profile
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!editMode}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
              Class Section
            </label>
            <input
              type="text"
              value={formData.classSection}
              onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
              disabled={!editMode}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Lock className="h-6 w-6 mr-2 text-green-500" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 