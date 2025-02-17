import { useEffect, useState } from 'react';
import api from '../api';

function PointsView() {
  const [points, setPoints] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const history = await api.get('/points/history');
        const leader = await api.get('/points/leaderboard');
        setPoints(history.data);
        setLeaderboard(leader.data);
      } catch (err) {
        console.error('Failed to load points:', err);
      }
    };
    loadData();
  }, []);

  // ... rest of your component ...
} 