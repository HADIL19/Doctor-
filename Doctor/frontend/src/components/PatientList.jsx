import { useState } from 'react';
import { Search, Filter, ChevronDown, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientList() {
  // Sample patients data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Marie Laurent",
      age: 42,
      gender: "F",
      lastVisit: "12/03/2025",
      condition: "Hypertension",
      status: "Stable"
    },
    {
      id: 2,
      name: "Thomas Dubois",
      age: 65,
      gender: "M",
      lastVisit: "05/04/2025",
      condition: "Diabète type 2",
      status: "Suivi régulier"
    },
    {
      id: 3,
      name: "Sophie Martin",
      age: 28,
      gender: "F",
      lastVisit: "27/02/2025",
      condition: "Asthme",
      status: "Contrôlé"
    },
    {
      id: 4,
      name: "Lucas Moreau",
      age: 55,
      gender: "M",
      lastVisit: "08/04/2025",
      condition: "Arythmie cardiaque",
      status: "Sous traitement"
    },
    {
      id: 5,
      name: "Emma Petit",
      age: 34,
      gender: "F",
      lastVisit: "01/04/2025",
      condition: "Migraine chronique",
      status: "En amélioration"
    },
    {
      id: 6,
      name: "Louis Bernard",
      age: 71,
      gender: "M",
      lastVisit: "22/03/2025",
      condition: "Arthrite",
      status: "Stable"
    },
    {
      id: 7,
      name: "Julie Renard",
      age: 47,
      gender: "F",
      lastVisit: "30/03/2025",
      condition: "Hypothyroïdie",
      status: "Suivi régulier"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Liste des patients</h2>
        <p className="text-gray-600">Gérez votre liste de patients et accédez à leurs dossiers</p>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Rechercher un patient..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <Filter size={18} className="mr-2 text-gray-500" />
            Filtres
            <ChevronDown size={16} className="ml-2 text-gray-500" />
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Nouveau patient
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age/Genre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière visite
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{patient.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.age} ans / {patient.gender}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.condition}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    patient.status === "Stable" ? "bg-green-100 text-green-800" :
                    patient.status === "Suivi régulier" ? "bg-blue-100 text-blue-800" :
                    patient.status === "En amélioration" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.lastVisit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/patients/${patient.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Dossier
                  </Link>
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Rendez-vous</button>
                  <Link 
                    to={`/patients/${patient.id}/emergency`}
                    className="text-yellow-600 hover:text-yellow-800 inline-flex items-center"
                    title="Gestion des urgences"
                  >
                    <AlertTriangle size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}