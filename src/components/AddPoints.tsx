import React, { useState } from 'react';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addPoints } from '../lib/storage';

export default function AddPoints() {
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const pointsValue = parseInt(formData.get('points') as string, 10);
    const reason = formData.get('reason') as string;

    try {
      const comment = `I was given ${pointsValue} points for ${reason} in class`;
      addPoints(pointsValue, comment);
      toast.success('Points added successfully!');
      e.currentTarget.reset();
      setPoints(1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
              placeholder="Describe what you did to earn these points..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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