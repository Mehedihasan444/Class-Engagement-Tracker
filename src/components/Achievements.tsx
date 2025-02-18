/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../api';

export default function Achievements() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const loadBadges = async () => {
      const { data } = await api.get('/achievements');
      setBadges(data);
    };
    loadBadges();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">🏅 Your Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge: any) => (
          <div key={badge._id} className="text-center p-4 border rounded-lg">
            <div className="text-4xl mb-2">{badge.emoji}</div>
            <h3 className="font-semibold">{badge.name}</h3>
            <p className="text-sm text-gray-600">{badge.description}</p>
            <div className="mt-2 text-xs text-indigo-600">
              Earned {badge.earnedDate ? format(new Date(badge.earnedDate), 'MMM d') : 'Not earned'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 