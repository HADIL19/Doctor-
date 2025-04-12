// src/services/api.js
import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

/**
 * Base fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle HTTP errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur réseau est survenue' }));
      throw new Error(error.message || 'Une erreur est survenue');
    }

    // Return response data
    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

/**
 * Authentication service
 */
export const authService = {
  login: async (email, password) => {
    const data = await fetchAPI('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

/**
 * Dashboard service
 */
export const dashboardService = {
  getDashboardData: async () => {
    try {
      const data = await fetchAPI('/dashboard');
      return {
        stats: {
          appointmentsToday: data.stats.appointmentsToday || 0,
          pendingAppointments: data.stats.pendingAppointments || 0,
          activePatients: data.stats.activePatients || 0,
          satisfactionRate: data.stats.satisfactionRate || "0%"
        },
        upcomingAppointments: data.upcomingAppointments || [],
        recentActivities: data.recentActivities || [],
        alerts: data.alerts || []
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

/**
 * Patients service
 */
export const patientsService = {
  getPatients: async () => {
    return await fetchAPI('/patients');
  },
  
  getPatient: async (id) => {
    return await fetchAPI(`/patients/${id}`);
  },
  
  createPatient: async (patientData) => {
    return await fetchAPI('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },
  
  updatePatient: async (id, patientData) => {
    return await fetchAPI(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }
};

/**
 * Appointments service
 */
export const appointmentsService = {
  getAppointments: async (date = null) => {
    const queryParams = date ? `?date=${date}` : '';
    return await fetchAPI(`/appointments${queryParams}`);
  },
  
  createAppointment: async (appointmentData) => {
    return await fetchAPI('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }
};

/**
 * Emergency management service
 */
export const emergencyService = {
  getEmergencyData: async (patientId) => {
    return await fetchAPI(`/patients/${patientId}/emergency`);
  },
  
  updateCrisisProtocol: async (patientId, protocolData) => {
    return await fetchAPI(`/patients/${patientId}/crisis-protocol`, {
      method: 'POST',
      body: JSON.stringify(protocolData),
    });
  },
  
  addEmergencyContact: async (patientId, contactData) => {
    return await fetchAPI(`/patients/${patientId}/emergency-contacts`, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
  
  deleteEmergencyContact: async (contactId) => {
    return await fetchAPI(`/emergency-contacts/${contactId}`, {
      method: 'DELETE',
    });
  },
  
  addBehaviorJournalEntry: async (patientId, entryData) => {
    return await fetchAPI(`/patients/${patientId}/behavior-journal`, {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },
  
  deleteBehaviorJournalEntry: async (entryId) => {
    return await fetchAPI(`/behavior-journal/${entryId}`, {
      method: 'DELETE',
    });
  }
};

// 🗓️ Fetch appointments by date
export const fetchAppointmentsByDate = async (date) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };
  