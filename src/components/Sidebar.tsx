import { Link } from 'react-router-dom';
import { isAdmin } from '../stores/authStore';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r p-4">
      <nav className="space-y-1">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <span>🏆 Leaderboard</span>
        </Link>
        <Link
          to="/dashboard/add-points"
          className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <span>➕ Add Points</span>
        </Link>
        <Link
          to="/dashboard/history"
          className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <span>📜 History</span>
        </Link>
        {isAdmin() && (
          <Link
            to="/admin"
            className="flex items-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <span>🔑 Admin Panel</span>
          </Link>
        )}
      </nav>
    </div>
  );
} 