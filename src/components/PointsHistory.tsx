/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { format } from 'date-fns';
import { History, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import { useAuthStore } from '../stores/authStore';

export default function PointsHistory() {
  const [history, setHistory] = React.useState<any[]>([]);
  const [editingPoint, setEditingPoint] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ points: 0, reason: '' });
  const { student } = useAuthStore();

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/points/history');
        const filtered = data.filter((p: any) => p.studentId._id === student?._id);
        setHistory(filtered);
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Failed to load history');
      }
    };
    fetchHistory();
  }, [student?._id]);

  const handleDelete = async (pointId: string) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/points/${pointId}`);
        setHistory(prev => prev.filter(p => p._id !== pointId));
        toast.success('Points deleted');
      } catch (err:any) {
        toast.error(err.response?.data?.error || 'Delete failed');
      }
    }
  };

  const handleEdit = (pointId: string, currentPoints: number, currentReason: string) => {
    setEditingPoint(pointId);
    setEditForm({ points: currentPoints, reason: currentReason });
  };

  const handleUpdate = async (pointId: string) => {
    try {
      await api.patch(`/points/${pointId}`, editForm);
      setHistory(prev => prev.map(p => 
        p._id === pointId ? { ...p, ...editForm } : p
      ));
      setEditingPoint(null);
      toast.success('Points updated');
    } catch (err:any) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <History className="h-6 w-6 mr-2 text-indigo-500" />
        Points History
      </h2>
      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry._id} className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">
                  {entry.studentId?.name || 'Your Activity'}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(entry.date), 'MMM dd, yyyy hh:mm a')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  +{entry.points} points
                </span>
                {entry.studentId?._id === student?._id && (
                <>
                
                  <button 
                    onClick={() => handleEdit(entry._id, entry.points, entry.reason)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(entry._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
                )}
              </div>
            </div>
            <div className="mt-4">
              {editingPoint === entry._id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points
                    </label>
                    <input
                      type="number"
                      value={editForm.points}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        points: Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10) 
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="1"
                      max="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <textarea
                      value={editForm.reason}
                      onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows={3}
                      minLength={10}
                    />
                    {editForm.reason.length < 10 && (
                      <p className="text-red-500 text-sm mt-1">
                        {10 - editForm.reason.length} characters remaining
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingPoint(null)}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(entry._id)}
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                      disabled={editForm.reason.length < 10}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">{entry.reason}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Section: {entry.section}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No points history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}