/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ChevronDown, LogOut, User, Bell } from 'lucide-react';
import api from '../api';

export default function Navbar({ isMobileMenuOpen, setIsMobileMenuOpen }: { isMobileMenuOpen: boolean, setIsMobileMenuOpen: (isMobileMenuOpen: boolean) => void }) {
  const { student, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    if (student) fetchNotifications();
  }, [student]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
              {/* <span className="ml-2 text-xl font-bold">Class Engagement Tracker</span> */}
                  {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed  p-2  text-white bg-indigo-600 rounded-md"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
          
          </div>
          
          <div className="flex items-center space-x-4">
            {/* <Link
              to="/dashboard/leaderboard"
              className="px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              to="/dashboard/add-points"
              className="px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add Points
            </Link> */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-indigo-700 relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification._id}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                      >
                        <span>{notification.message}</span>
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-indigo-600 hover:text-indigo-900 text-xs"
                        >
                          Mark read
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 hover:bg-indigo-700 px-3 py-2 rounded-md transition-colors"
              >
                {/* Avatar with fallback */}
                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center">
                  {student?.avatarUrl ? (
                    <img 
                      src={student.avatarUrl} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <span className="text-indigo-600 font-medium">
                      {student?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {student?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {student?.email}
                    </p>
                  </div>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 