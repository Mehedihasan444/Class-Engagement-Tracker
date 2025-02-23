/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../api';
import { toast } from 'sonner';

export default function MandatoryProfileUpdate() {
  const { student, login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    classSection: ''
  });

  useEffect(() => {
    if (student?.studentId?.trim() && student?.classSection?.trim()) {
      navigate('/dashboard');
    }
  }, [student, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.studentId.trim() || !formData.classSection.trim()) {
      return toast.error('All fields are required');
    }

    try {
      const { data } = await api.patch('/auth/mandatory-update', {
        studentId: formData.studentId.trim(),
        classSection: formData.classSection.trim()
      });
      console.log(data,"data")
      login(data.student, data.token);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage === 'Student ID already exists') {
        toast.error('This student ID is already registered. Please use a different ID.');
      } else {
        toast.error(errorMessage || 'Update failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
        <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 shrink-0" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                clipRule="evenodd" 
              />
            </svg>
            <p className="text-sm">
              This information is required to track your participation and ensure 
              proper class section ranking on the leaderboard. You won't be able to 
              use the app until you complete this step.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Student ID
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded-md`}
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Class Section
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.classSection}
              onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
} 