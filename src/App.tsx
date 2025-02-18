import  {  useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import PointsHistory from './components/PointsHistory';
import AddPoints from './components/AddPoints';
import Statistics from './components/Statistics';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Auth />} />
        
        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Leaderboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="add-points" element={<AddPoints />} />
          <Route path="history" element={<PointsHistory />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute>
            <Dashboard/>
              
          </ProtectedRoute>
        } >
          
       <Route index element={<Leaderboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="add-points" element={<AddPoints />} />
          <Route path="history" element={<PointsHistory />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="profile" element={<Profile />} />
        <Route path="panel" element={
          <AdminPanel />
      } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;