import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Activity, User, ThumbsUp } from 'lucide-react';
import { dashboardService } from '../../services/api';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      appointmentsToday: 0,
      pendingAppointments: 0,
      activePatients: 0,
      satisfactionRate: "0%"
    },
    upcomingAppointments: [],
    recentActivities: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Map backend stats to UI stats format
  const stats = [
    { 
      title: "Rendez-vous aujourd'hui", 
      value: dashboardData.stats.appointmentsToday, 
      icon: <Calendar size={24} className="text-blue-500" />, 
      color: "bg-blue-50 border-blue-100" 
    },
    { 
      title: "En attente", 
      value: dashboardData.stats.pendingAppointments, 
      icon: <Clock size={24} className="text-amber-500" />, 
      color: "bg-amber-50 border-amber-100" 
    },
    { 
      title: "Patients actifs", 
      value: dashboardData.stats.activePatients, 
      icon: <User size={24} className="text-green-500" />, 
      color: "bg-green-50 border-green-100" 
    },
    { 
      title: "Taux de satisfaction", 
      value: dashboardData.stats.satisfactionRate, 
      icon: <ThumbsUp size={24} className="text-purple-500" />, 
      color: "bg-purple-50 border-purple-100" 
    }
  ];

  // Function to determine alert priority color
  const getAlertStyles = (priority) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-red-50', text: 'text-red-500' };
      case 'medium':
        return { bg: 'bg-amber-50', text: 'text-amber-500' };
      default:
        return { bg: 'bg-blue-50', text: 'text-blue-500' };
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex justify-center">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>
        <p className="text-gray-600">Bienvenue, Dr. Sarah Johnson</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} p-6 rounded-lg border flex items-center`}>
            <div className="mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout for remaining dashboard elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Rendez-vous à venir</h3>
              <a href="#" className="text-blue-600 text-sm hover:underline">Voir tous</a>
            </div>
            {dashboardData.upcomingAppointments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {dashboardData.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="px-6 py-4 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-medium">{appointment.time}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {appointment.date === new Date().toISOString().split('T')[0] ? 'Aujourd\'hui' : appointment.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Aucun rendez-vous à venir aujourd'hui</p>
              </div>
            )}
          </div>

          {/* Patient distribution chart placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Répartition des patients par pathologie</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <Activity size={48} className="text-gray-400" />
              <span className="ml-2 text-gray-500">Graphique de répartition</span>
            </div>
          </div>
        </div>

        {/* Right column (1/3 width) */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Alertes</h3>
            </div>
            {dashboardData.alerts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {dashboardData.alerts.map((alert) => {
                  const alertStyle = getAlertStyles(alert.priority);
                  return (
                    <div key={alert.id} className={`px-6 py-4 flex items-start ${alertStyle.bg}`}>
                      <AlertCircle className={`flex-shrink-0 mr-3 ${alertStyle.text}`} size={20} />
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Aucune alerte active</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Activité récente</h3>
            </div>
            {dashboardData.recentActivities.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <p className="text-sm text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}