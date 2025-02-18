import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export default function Settings() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklySummary: true,
    achievementAlerts: true
  });

  const handleSave = async () => {
    await api.patch('/user/preferences', preferences);
    toast.success('Preferences updated!');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-600">Receive important updates via email</p>
          </div>
          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
            className="h-5 w-5 text-indigo-600"
          />
        </div>
        {/* Add similar blocks for other preferences */}
        <button
          onClick={handleSave}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
} 