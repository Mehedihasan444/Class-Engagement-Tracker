import React, { useState, useEffect } from 'react';
import { Trophy, Award, History, LogIn, UserPlus, GanttChartSquare as ChartSquare } from 'lucide-react';
import { Toaster } from 'sonner';
import { getCurrentUser, signOut } from './lib/storage';
import Auth from './components/Auth';
import Leaderboard from './components/Leaderboard';
import PointsHistory from './components/PointsHistory';
import AddPoints from './components/AddPoints';
import Statistics from './components/Statistics';

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [view, setView] = useState<'leaderboard' | 'history' | 'add' | 'stats'>('leaderboard');

  useEffect(() => {
    const checkUser = () => setUser(getCurrentUser());
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <Auth onSignIn={() => setUser(getCurrentUser())} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <nav className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Trophy className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Class Engagement Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('leaderboard')}
                className={`px-3 py-2 rounded-md ${
                  view === 'leaderboard' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <Award className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-3 py-2 rounded-md ${
                  view === 'history' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <History className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('add')}
                className={`px-3 py-2 rounded-md ${
                  view === 'add' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <UserPlus className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('stats')}
                className={`px-3 py-2 rounded-md ${
                  view === 'stats' ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <ChartSquare className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  signOut();
                  setUser(null);
                }}
                className="px-3 py-2 rounded-md hover:bg-indigo-700"
              >
                <LogIn className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'leaderboard' && <Leaderboard />}
        {view === 'history' && <PointsHistory />}
        {view === 'add' && <AddPoints />}
        {view === 'stats' && <Statistics />}
      </main>
    </div>
  );
}

export default App;