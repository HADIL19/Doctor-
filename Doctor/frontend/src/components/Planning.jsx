import { useState } from 'react';
import { Clock, Video, Phone, User } from 'lucide-react';

export default function Planning() {
  // Sample appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "Marie Laurent",
      time: "09:00",
      duration: "30 min",
      type: "In-person",
      status: "Confirmed",
      reason: "Annual check-up"
    },
    {
      id: 2,
      patientName: "Thomas Dubois",
      time: "10:00",
      duration: "45 min",
      type: "Video",
      status: "Confirmed",
      reason: "Follow-up consultation"
    },
    {
      id: 3,
      patientName: "Sophie Martin",
      time: "11:15",
      duration: "30 min",
      type: "Phone",
      status: "Confirmed",
      reason: "Prescription renewal"
    },
    {
      id: 4,
      patientName: "Lucas Moreau",
      time: "13:30",
      duration: "60 min",
      type: "In-person",
      status: "Confirmed",
      reason: "New patient consultation"
    },
    {
      id: 5,
      patientName: "Emma Petit",
      time: "15:00",
      duration: "30 min",
      type: "Video",
      status: "Confirmed",
      reason: "Test results review"
    }
  ]);

  // Get current date in French format
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', options);

  // Function to get appointment type icon
  const getAppointmentIcon = (type) => {
    switch(type) {
      case 'Video':
        return <Video size={16} className="text-blue-500" />;
      case 'Phone':
        return <Phone size={16} className="text-green-500" />;
      case 'In-person':
      default:
        return <User size={16} className="text-purple-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Planning</h2>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Nouveau rendez-vous
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="w-24 font-medium text-gray-500">Heure</div>
          <div className="flex-1 font-medium text-gray-500">Patient</div>
          <div className="w-32 font-medium text-gray-500">Type</div>
          <div className="w-32 font-medium text-gray-500">Durée</div>
          <div className="w-32 font-medium text-gray-500">Statut</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center px-6 py-4 hover:bg-gray-50">
              <div className="w-24 flex items-center">
                <Clock size={16} className="mr-2 text-gray-400" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{appointment.patientName}</p>
                <p className="text-sm text-gray-500">{appointment.reason}</p>
              </div>
              <div className="w-32 flex items-center">
                {getAppointmentIcon(appointment.type)}
                <span className="ml-2">{appointment.type}</span>
              </div>
              <div className="w-32">{appointment.duration}</div>
              <div className="w-32">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}