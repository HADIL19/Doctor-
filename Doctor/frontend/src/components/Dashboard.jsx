import { useState } from 'react';
import { Calendar, Clock, AlertCircle, Activity, User, ThumbsUp } from 'lucide-react';

export default function Dashboard() {
  // Sample stats for the dashboard
  const stats = [
    { title: "Rendez-vous aujourd'hui", value: 8, icon: <Calendar size={24} className="text-blue-500" />, color: "bg-blue-50 border-blue-100" },
    { title: "En attente", value: 3, icon: <Clock size={24} className="text-amber-500" />, color: "bg-amber-50 border-amber-100" },
    { title: "Patients actifs", value: 124, icon: <User size={24} className="text-green-500" />, color: "bg-green-50 border-green-100" },
    { title: "Taux de satisfaction", value: "98%", icon: <ThumbsUp size={24} className="text-purple-500" />, color: "bg-purple-50 border-purple-100" }
  ];

  // Sample upcoming appointments
  const upcomingAppointments = [
    { id: 1, patient: "Marie Laurent", time: "09:00", date: "Aujourd'hui", type: "Check-up annuel" },
    { id: 2, patient: "Thomas Dubois", time: "10:00", date: "Aujourd'hui", type: "Consultation de suivi" },
    { id: 3, patient: "Sophie Martin", time: "11:15", date: "Aujourd'hui", type: "Renouvellement d'ordonnance" }
  ];

  // Sample recent activities
  const recentActivities = [
    { id: 1, message: "Dossier de Sophie Martin mis à jour", time: "Il y a 20 minutes" },
    { id: 2, message: "Nouveau rendez-vous avec Lucas Moreau", time: "Il y a 1 heure" },
    { id: 3, message: "Résultats d'analyses reçus pour Emma Petit", time: "Il y a 2 heures" },
    { id: 4, message: "Message de rappel envoyé à tous les RDV de demain", time: "Il y a 3 heures" }
  ];

  // Sample alerts
  const alerts = [
    { id: 1, message: "5 patients nécessitent un renouvellement d'ordonnance cette semaine", priority: "medium" },
    { id: 2, message: "Résultats d'analyses urgents pour Thomas Dubois", priority: "high" },
    { id: 3, message: "Mise à jour du système prévue ce weekend", priority: "low" }
  ];

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
            <div className="divide-y divide-gray-200">
              {upcomingAppointments.map((appointment) => (
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
                      {appointment.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <div key={alert.id} className={`px-6 py-4 flex items-start ${
                  alert.priority === 'high' ? 'bg-red-50' : 
                  alert.priority === 'medium' ? 'bg-amber-50' : 'bg-blue-50'
                }`}>
                  <AlertCircle className={`flex-shrink-0 mr-3 ${
                    alert.priority === 'high' ? 'text-red-500' : 
                    alert.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`} size={20} />
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Activité récente</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

