import  { useState, useEffect } from 'react';
import { Trophy, Award, History, LogIn, UserPlus, GanttChartSquare as ChartSquare } from 'lucide-react';
import { Toaster } from 'sonner';
import {  signOut } from './lib/storage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import PointsHistory from './components/PointsHistory';
import AddPoints from './components/AddPoints';
import Statistics from './components/Statistics';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { student, initialize } = useAuthStore();
  const [view, setView] = useState<'leaderboard' | 'history' | 'add' | 'stats'>('leaderboard');

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!student) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Auth onSignIn={() => window.location.href = '/dashboard'} />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<Leaderboard />} />
            <Route path="add-points" element={<AddPoints />} />
            <Route path="history" element={<PointsHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>
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
                  window.location.href = '/login';
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