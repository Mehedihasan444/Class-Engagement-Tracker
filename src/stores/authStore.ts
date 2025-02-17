import { create } from 'zustand';

interface AuthState {
  student: null | { _id: string; name: string; role: string };
  token: string | null;
  login: (student: any, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  student: null,
  token: null,
  login: (student, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('student', JSON.stringify(student));
    set({ student, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    set({ student: null, token: null });
  },
  initialize: () => {
    const token = localStorage.getItem('token');
    const student = JSON.parse(localStorage.getItem('student') || 'null');
    if (token && student) {
      set({ student, token });
    }
  }
}));

export const isAdmin = () => useAuthStore.getState().student?.role === 'admin'; 