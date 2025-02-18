import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar'; // Create a sidebar component

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 ">
          <Navbar />
          <div className="p-8 bg-gray-50 h-full">
              <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
} 