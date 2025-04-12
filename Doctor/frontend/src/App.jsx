import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';

import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import Planning from './components/Planning';
import EmergencyManagement from './components/EmergencyManagement';
import Sidebar from './components/Sidebar';

function DoctorInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    if (location.pathname.includes('/planning')) return 'Planning';
    if (location.pathname.includes('/patients')) return 'Liste des patients';
    return 'Tableau de bord';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="text-gray-600 md:hidden">
                <Menu size={24} />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800 md:ml-0">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-700">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Cardiologie</p>
              </div>
              <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600">
                <LogOut size={18} className="mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<DoctorInterface />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id/emergency" element={<EmergencyManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
