import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useState, useEffect } from 'react';
import api from '../api';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { student } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get('/auth/verify');
        setLoading(false);
      } catch (err) {
        console.log(err)
        useAuthStore.getState().logout();
      }
    };

    if (student) verifyToken();
    else setLoading(false);
  }, [student]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <Navigate to="/login" replace />;
  
  return children;
} 