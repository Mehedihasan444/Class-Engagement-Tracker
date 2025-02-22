import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../api';

export default function GoogleCallback() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          const { data } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          login(data, token);
          navigate('/dashboard');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    
    handleAuth();
  }, [login, navigate]);

  return <div>Processing Google login...</div>;
} 