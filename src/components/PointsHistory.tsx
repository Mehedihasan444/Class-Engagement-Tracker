import React from 'react';
import { format } from 'date-fns';
import { History, Star, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';

export default function PointsHistory() {
  const [history, setHistory] = React.useState<any[]>([]);
  const [editingPoint, setEditingPoint] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ points: 0, comment: '' });

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/points/history');
        setHistory(data);
      } catch (err) {
        toast.error('Failed to load history');
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (pointId: string) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/points/${pointId}`);
        setHistory(prev => prev.filter(p => p._id !== pointId));
        toast.success('Points deleted');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleEdit = (pointId: string, currentPoints: number, currentComment: string) => {
    setEditingPoint(pointId);
    setEditForm({ points: currentPoints, comment: currentComment });
  };

  const handleUpdate = async (pointId: string) => {
    try {
      await api.patch(`/points/${pointId}`, editForm);
      setHistory(prev => prev.map(p => 
        p._id === pointId ? { ...p, ...editForm } : p
      ));
      setEditingPoint(null);
      toast.success('Points updated');
    } catch (err) {
      toast.error('Update failed');
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
          <div
            key={entry.id}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
              entry.isCurrentUser ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  {entry.student.name}
                  {entry.isCurrentUser && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      You
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">Student ID: {entry.student.studentId}</p>
              </div>
              <div className="text-right flex items-start space-x-2">
                {entry.isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(entry.id, entry.points, entry.comment)}
                      className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Star className="h-4 w-4 mr-1" />
                  +{entry.points} points
                </span>
              </div>
            </div>
            
            {editingPoint === entry.id ? (
              <div className="mt-2 space-y-3">
                <input
                  type="number"
                  value={editForm.points}
                  onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={2}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingPoint(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdate(entry.id)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-600">{entry.comment}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(entry.date), 'PPp')}
            </p>
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