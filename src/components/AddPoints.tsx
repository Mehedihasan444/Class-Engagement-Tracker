/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import { useAuthStore } from '../stores/authStore';

export default function AddPoints() {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(1);
  const [dailyLimit] = useState(20);
  const [usedPoints, setUsedPoints] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reason, setReason] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [history, setHistory] = useState<EngagementPoint[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const { student } = useAuthStore();

  useEffect(() => {
    const fetchDailyUsage = async () => {
      const { data } = await api.get('/points/today');
      setUsedPoints(data.total);
    };
    fetchDailyUsage();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await api.get('/students');
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!student) return toast.error('Please log in to add points');
    
    const formData = new FormData(e.currentTarget);
    const pointsValue = parseInt(formData.get('points') as string, 10);
    const reasonValue = formData.get('reason') as string;

    // Client-side validation
    if (reasonValue.length < 10) {
      return toast.error('Reason must be at least 10 characters', {
        position: 'top-right',
        duration: 3000
      });
    }

    try {
      const { data } = await api.post('/points', {
        points: pointsValue,
        reason: reasonValue,
        section: student?.classSection,
        studentId: student?._id
      });

      // Update local state with server response
      setUsedPoints(prev => prev + data.points);
      setHistory(prev => [data, ...prev]);
      
      toast.success(`Successfully added ${data.points} points to ${student.name} in ${data.section}`, {
        position: 'top-right',
        duration: 3000
      });
      
      updateLeaderboard();
      
    } catch (error: any) {
      const message = error.response?.data?.error || 'Submission failed';
      toast.error(message);
    }
  };

  const updateLeaderboard = async () => {
    try {
      const { data } = await api.get('/points/leaderboard');
      // Add ranking to the data
      const rankedData = data.map((entry: any, index: number) => ({
        ...entry,
        rank: index + 1
      }));
      setLeaderboard(rankedData);
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <PlusCircle className="h-6 w-6 mr-2 text-green-500" />
          Add Engagement Points
        </h2>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Daily Points Limit</h3>
              <p className="mt-1 text-sm text-blue-700">
                You can earn up to 20 points per day. Each submission must be between 1 and 10 points.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Daily Progress ({dailyLimit - usedPoints} remaining)</span>
            <span>{usedPoints}/{dailyLimit}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-green-500 rounded-full transition-all" 
              style={{ width: `${(usedPoints/dailyLimit)*100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700">
              Points Earned
            </label>
            <div className="mt-1">
              <input
                type="range"
                id="points"
                name="points"
                min="1"
                max="10"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-indigo-600">{points}</span>
                <span className="text-gray-600"> points</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for Points
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              required
              minLength={10}
              className={`mt-1 block w-full rounded-md border-${
                reason.length > 0 && reason.length < 10 ? 'red-500' : 'gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              placeholder="Describe what you did to earn these points..."
              onChange={(e) => setReason(e.target.value)}
            />
            {reason.length > 0 && reason.length < 10 && (
              <p className="text-red-500 text-sm mt-1">
                Reason must be at least 10 characters ({(10 - reason.length)} remaining)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding Points...' : 'Add Points'}
          </button>
        </form>
      </div>
    </div>
  );
}