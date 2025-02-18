import { Link, useMatch } from 'react-router-dom';
import { isAdmin, useAuthStore } from '../stores/authStore';
import { 
  Trophy, 
  PlusSquare, 
  History, 
  User, 
  Shield,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const match = useMatch('/dashboard/:path');
  const activePath = match?.params.path;

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 h-screen p-4 flex flex-col sticky top-0 left-0 bottom-0">
      <div className="my-8">
        <h2 className="text-white text-center flex justify-center text-xl font-bold  items-center gap-2 mb-6 px-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          CET
        </h2>
        
        <nav className="space-y-1 mt-12">
          <Link 
            to="/dashboard/leaderboard" 
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              activePath === 'leaderboard' 
                ? 'bg-indigo-600 shadow-md border-l-4 border-yellow-400' 
                : 'hover:bg-indigo-600/50'
            }`}
          >
            <Trophy className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Leaderboard</span>
          </Link>

          <Link
            to="/dashboard/add-points"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              activePath === 'add-points' 
                ? 'bg-indigo-600 shadow-md border-l-4 border-yellow-400' 
                : 'hover:bg-indigo-600/50'
            }`}
          >
            <PlusSquare className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Add Points</span>
          </Link>

          <Link
            to="/dashboard/history"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              activePath === 'history' 
                ? 'bg-indigo-600 shadow-md border-l-4 border-yellow-400' 
                : 'hover:bg-indigo-600/50'
            }`}
          >
            <History className="h-5 w-5 text-white" />
            <span className="text-white font-medium">History</span>
          </Link>
          <Link
            to="/dashboard/stats"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              activePath === 'stats' 
                ? 'bg-indigo-600 shadow-md border-l-4 border-yellow-400' 
                : 'hover:bg-indigo-600/50'
            }`}
          >
            <History className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Statistics</span>
          </Link>

          <Link
            to="/dashboard/profile"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              activePath === 'profile' 
                ? 'bg-indigo-600 shadow-md border-l-4 border-yellow-400' 
                : 'hover:bg-indigo-600/50'
            }`}
          >
            <User className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Profile</span>
          </Link>
        </nav>
      </div>

      {isAdmin() && (
        <div className="mt-auto border-t border-indigo-500 pt-4">
          <Link
            to="/admin/panel"
            className="flex items-center space-x-3 p-3 rounded-lg text-red-100 hover:bg-indigo-600/50 transition-all"
          >
            <Shield className="h-5 w-5" />
            <span className="font-medium">Admin Panel</span>
          </Link>
        </div>
      )}

      <div className="mt-auto border-t border-indigo-500 pt-4">
        <button
          onClick={() => {
            useAuthStore.getState().logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-100 hover:bg-indigo-600/50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
        
        <div className="mt-4 text-center text-indigo-300 text-sm">
          v1.0.0
        </div>
      </div>
    </div>
  );
} 