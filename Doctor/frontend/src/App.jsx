import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Calendar, Users, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import Planning from './components/Planning';
import EmergencyManagement from './components/EmergencyManagement';


function DoctorInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fonction pour obtenir le titre de la page active
  const getPageTitle = () => {
    if (location.pathname.includes('/planning')) return 'Planning';
    if (location.pathname.includes('/patients')) return 'Liste des patients';
    return 'Tableau de bord';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - mobile version (hidden by default) */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
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
                onClick={() => setSidebarOpen(false)}
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
                onClick={() => setSidebarOpen(false)}
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
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard className="mr-3" size={20} />
                <span className="font-medium">Dashboard</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </div>

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

        {/* Page content - Outlet rend le composant actif de la route */}
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
        {/* Redirection de la racine vers le dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Routes principales avec DoctorInterface comme layout */}
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