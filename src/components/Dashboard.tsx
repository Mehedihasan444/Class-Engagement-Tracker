import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar'; // Create a sidebar component
import { useState } from 'react';

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
        <div className="md:hidden z-">
          <div className={`fixed ${isMobileMenuOpen ? "z-40" : "z-0"}`}>

            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          </div>

        </div>
        <div className="flex-1 ">
          <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
          <div className="p-8 bg-gray-50 ">

            <Outlet />

          </div>
        </div>
      </div>


    </div>
  );
} 