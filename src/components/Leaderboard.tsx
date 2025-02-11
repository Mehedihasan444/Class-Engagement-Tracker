import React from 'react';
import { Trophy, Crown, Medal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getLeaderboard, isAdmin, deleteStudent, updateStudent } from '../lib/storage';

export default function Leaderboard() {
  const leaderboard = getLeaderboard();
  const isAdminUser = isAdmin();
  const [editingStudent, setEditingStudent] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({ name: '', studentId: '', classSection: '' });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const handleDelete = (studentId: string) => {
    if (confirm('Are you sure you want to delete this student? All their points will be deleted too.')) {
      try {
        deleteStudent(studentId);
        toast.success('Student deleted successfully');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (student: { name: string; studentId: string; classSection: string }) => {
    setEditingStudent(student.studentId);
    setEditForm(student);
  };

  const handleUpdate = (studentId: string) => {
    try {
      updateStudent(studentId, editForm);
      setEditingStudent(null);
      toast.success('Student updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
        Class Engagement Leaderboard
      </h2>

      {/* Top 3 Cards */}
      {leaderboard.slice(0, 3).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {leaderboard.slice(0, 3).map((entry) => (
            <div
              key={entry.studentId}
              className={`p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform ${
                entry.isCurrentUser ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                {getRankIcon(entry.rank)}
                <span className="text-4xl font-bold text-indigo-600">{entry.totalPoints}</span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{entry.name}</h3>
              <p className="text-sm text-gray-600">ID: {entry.studentId}</p>
              <p className="text-sm text-gray-600">Section: {entry.classSection}</p>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              {isAdminUser && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((entry) => (
              <tr
                key={entry.studentId}
                className={`${
                  entry.isCurrentUser ? 'bg-indigo-50' : entry.rank <= 3 ? 'bg-yellow-50' : ''
                } hover:bg-gray-50 transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">#{entry.rank}</span>
                    {getRankIcon(entry.rank)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStudent === entry.studentId ? (
                    <input
                      type="text"
                      value={editForm.studentId}
                      onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{entry.studentId}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStudent === entry.studentId ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          You
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingStudent === entry.studentId ? (
                    <input
                      type="text"
                      value={editForm.classSection}
                      onChange={(e) => setEditForm({ ...editForm, classSection: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{entry.classSection}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{entry.totalPoints}</div>
                </td>
                {isAdminUser && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingStudent === entry.studentId ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingStudent(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(entry.id)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}