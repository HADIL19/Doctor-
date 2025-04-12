// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Calendar, Users, LayoutDashboard, X } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
      <div className="flex items-center justify-between p-4 text-white">
        <h2 className="text-xl font-bold">MedPortal</h2>
        <button onClick={toggleSidebar} className="md:hidden text-white">
          <X size={24} />
        </button>
      </div>

      <nav className="mt-8">
        <div className="px-4 mb-8">
          <div className="p-2 rounded-lg mb-2">
            <NavLink 
              to="/planning" 
              className={({ isActive }) => 
                `flex items-center text-white p-2 rounded-md ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
              }
              onClick={toggleSidebar}
            >
              <Calendar className="mr-3" size={20} />
              <span className="font-medium">Planning</span>
            </NavLink>
          </div>
          <div className="p-2 rounded-lg mb-2">
            <NavLink 
              to="/patients" 
              className={({ isActive }) => 
                `flex items-center text-white p-2 rounded-md ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
              }
              onClick={toggleSidebar}
            >
              <Users className="mr-3" size={20} />
              <span className="font-medium">Liste des patients</span>
            </NavLink>
          </div>
          <div className="p-2 rounded-lg">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center text-white p-2 rounded-md ${isActive ? 'bg-blue-700' : 'hover:bg-blue-700'}`
              }
              onClick={toggleSidebar}
            >
              <LayoutDashboard className="mr-3" size={20} />
              <span className="font-medium">Dashboard</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
