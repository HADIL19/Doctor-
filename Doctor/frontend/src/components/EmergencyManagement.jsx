// components/EmergencyManagement.jsx
import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, BookOpen, Plus } from 'lucide-react';
import { emergencyService } from '../../services/api'; // adjust path as needed

export default function EmergencyManagement() {
  const patientId = 1; // Replace with dynamic patient ID later

  const [crisisProtocol, setCrisisProtocol] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [behaviorJournal, setBehaviorJournal] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [newEntry, setNewEntry] = useState({ date: '', trigger: '', solution: '', duration: '' });

  useEffect(() => {
    const loadEmergencyData = async () => {
      try {
        const data = await emergencyService.getEmergencyData(patientId);
        setCrisisProtocol(data.crisisProtocol || {
          calm_space: '',
          soothing_object: '',
          other_strategies: ''
        });
        setEmergencyContacts(data.emergencyContacts);
        setBehaviorJournal(data.behaviorJournal);
      } catch (error) {
        console.error("Error loading emergency data:", error);
      }
    };

    loadEmergencyData();
  }, []);

  const handleAddContact = async () => {
    if (newContact.name && newContact.phone) {
      try {
        const saved = await emergencyService.addEmergencyContact(patientId, newContact);
        setEmergencyContacts([...emergencyContacts, saved]);
        setNewContact({ name: '', phone: '', relation: '' });
      } catch (error) {
        console.error('Failed to add contact:', error);
      }
    }
  };

  const handleAddJournalEntry = async () => {
    if (newEntry.trigger && newEntry.solution) {
      try {
        const entryWithDate = {
          ...newEntry,
          event_date: newEntry.date || new Date().toISOString()
        };
        const saved = await emergencyService.addBehaviorJournalEntry(patientId, entryWithDate);
        setBehaviorJournal([saved, ...behaviorJournal]);
        setNewEntry({ date: '', trigger: '', solution: '', duration: '' });
      } catch (error) {
        console.error('Failed to add behavior entry:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Crisis Protocol */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" size={20} />
          Protocole de crise
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Espace calme</h4>
            <p>{crisisProtocol?.calm_space}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Objet apaisant</h4>
            <p>{crisisProtocol?.soothing_object}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Autres stratégies</h4>
            <p>{crisisProtocol?.other_strategies}</p>
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Modifier le protocole
        </button>
      </div>

      {/* Emergency Contacts */}
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

        {/* Add contact form */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Ajouter un contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Nom"
              className="p-2 border rounded"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Téléphone"
              className="p-2 border rounded"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="Relation"
              className="p-2 border rounded"
              value={newContact.relation}
              onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
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

      {/* Behavior Journal */}
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
                  <td className="px-6 py-4 whitespace-nowrap">{entry.event_date}</td>
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

        {/* Add entry form */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Ajouter une entrée</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="Date/Heure"
              className="p-2 border rounded"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Déclencheur"
              className="p-2 border rounded"
              value={newEntry.trigger}
              onChange={(e) => setNewEntry({ ...newEntry, trigger: e.target.value })}
            />
            <input
              type="text"
              placeholder="Solution"
              className="p-2 border rounded"
              value={newEntry.solution}
              onChange={(e) => setNewEntry({ ...newEntry, solution: e.target.value })}
            />
            <input
              type="text"
              placeholder="Durée"
              className="p-2 border rounded"
              value={newEntry.duration}
              onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
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
