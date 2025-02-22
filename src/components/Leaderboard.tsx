/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Trophy, Crown, Medal } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = React.useState<any[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState('All');

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/points/leaderboard');
        const processedData = data.map((entry: any) => ({
          ...entry,
          student: {
            ...entry.student,
            studentId: entry.student.studentId,
            classSection: entry.student.classSection
          }
        }));
        setLeaderboard(processedData);
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Failed to load leaderboard');
      }
    };
    fetchLeaderboard();
  }, []);

  React.useEffect(() => {
    const fetchSections = async () => {
      const { data } = await api.get('/students/class-sections');
      setSections(data);
    };
    fetchSections();
  }, []);


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

  const filteredLeaderboard = leaderboard.filter(student => 
    selectedSection === 'All' || student.classSection === selectedSection
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Trophy className="h-6 w-6 mr-2" />
          Class Leaderboard
        </h2>
        <select 
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500"
        >
          <option>All</option>
          {sections.map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
      </div>

      {/* Top 3 Cards */}
      {filteredLeaderboard.slice(0, 3).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {filteredLeaderboard.slice(0, 3).map((entry) => (
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
              <h3 className="font-semibold text-lg mb-1">{entry.student.name}</h3>
              <p className="text-sm text-gray-600">ID: {entry.student.studentId}</p>
              <p className="text-sm text-gray-600">Section: {entry.student.classSection}</p>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No leaderboard data available yet</p>
        </div>
      ) : (
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
                {/* Assuming isAdminUser is true for the given code */}
                {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaderboard.map((entry) => (
                <tr
                  key={entry._id}
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
                    {entry.student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.student.classSection}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.totalPoints}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {student && (entry.student._id === student._id || student.role === 'admin') && (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(entry.student)}
                          className="text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.student.studentId)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}