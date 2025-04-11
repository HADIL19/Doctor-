// components/EmergencyManagement.jsx
import { useState } from 'react';
import { AlertTriangle, Clock, BookOpen, Plus } from 'lucide-react';

export default function EmergencyManagement({ patientId }) {
  // Données d'exemple
  const [crisisProtocol, setCrisisProtocol] = useState({
    calmSpace: "Chambre avec lumière tamisée",
    soothingObject: "Doudou en peluche",
    other: "Musique douce, couverture lestée"
  });
  
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "Mère", phone: "06 12 34 56 78", relation: "Parent" },
    { name: "Éducatrice", phone: "06 87 65 43 21", relation: "Professionnelle" }
  ]);
  
  const [behaviorJournal, setBehaviorJournal] = useState([
    { date: "10/04/2025 15:30", trigger: "Bruit fort", solution: "Retrait dans espace calme", duration: "20 min" },
    { date: "05/04/2025 09:15", trigger: "Changement d'emploi du temps", solution: "Explication visuelle", duration: "15 min" }
  ]);
  
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [newEntry, setNewEntry] = useState({ date: '', trigger: '', solution: '', duration: '' });

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContact({ name: '', phone: '', relation: '' });
    }
  };

  const handleAddJournalEntry = () => {
    if (newEntry.trigger && newEntry.solution) {
      const entryWithDate = {
        ...newEntry,
        date: newEntry.date || new Date().toLocaleString('fr-FR')
      };
      setBehaviorJournal([...behaviorJournal, entryWithDate]);
      setNewEntry({ date: '', trigger: '', solution: '', duration: '' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" size={20} />
          Protocole de crise
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Espace calme</h4>
            <p>{crisisProtocol.calmSpace}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Objet apaisant</h4>
            <p>{crisisProtocol.soothingObject}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Autres stratégies</h4>
            <p>{crisisProtocol.other}</p>
          </div>
        </div>
        
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Modifier le protocole
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Contacts d'urgence</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Relation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emergencyContacts.map((contact, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.relation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                    <button className="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Ajouter un contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Nom"
              className="p-2 border rounded"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Téléphone"
              className="p-2 border rounded"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
            />
            <input
              type="text"
              placeholder="Relation"
              className="p-2 border rounded"
              value={newContact.relation}
              onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
            />
            <button 
              onClick={handleAddContact}
              className="flex items-center justify-center bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              <Plus size={16} className="mr-1" /> Ajouter
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="mr-2 text-blue-500" size={20} />
          Journal des comportements
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Déclencheur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solution efficace</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {behaviorJournal.map((entry, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.trigger}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.solution}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                    <button className="text-red-600 hover:text-red-800">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Ajouter une entrée</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="Date/Heure"
              className="p-2 border rounded"
              value={newEntry.date}
              onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
            />
            <input
              type="text"
              placeholder="Déclencheur"
              className="p-2 border rounded"
              value={newEntry.trigger}
              onChange={(e) => setNewEntry({...newEntry, trigger: e.target.value})}
            />
            <input
              type="text"
              placeholder="Solution"
              className="p-2 border rounded"
              value={newEntry.solution}
              onChange={(e) => setNewEntry({...newEntry, solution: e.target.value})}
            />
            <input
              type="text"
              placeholder="Durée"
              className="p-2 border rounded"
              value={newEntry.duration}
              onChange={(e) => setNewEntry({...newEntry, duration: e.target.value})}
            />
            <button 
              onClick={handleAddJournalEntry}
              className="flex items-center justify-center bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              <Plus size={16} className="mr-1" /> Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}