import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

////////////////////////////////////
//  1) MySQL Connection Pool
////////////////////////////////////
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

////////////////////////////////////
//  2) Express App Setup
////////////////////////////////////
const app = express();
app.use(cors());
app.use(express.json());

////////////////////////////////////
//  3) Routes
////////////////////////////////////

// Authentication routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, you would use bcrypt to compare the password hash
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // For simplicity, we're not checking the password hash here
    // In a real app, you would use bcrypt.compare(password, users[0].password)
    
    const user = users[0];
    delete user.password; // Don't send password back
    
    res.json({ 
      user,
      token: 'sample-token' // In a real app, you would generate a JWT token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard data route
app.get('/api/dashboard', async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's appointments count
    const [appointmentsToday] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ?',
      [today]
    );
    
    // Get pending appointments count
    const [pendingAppointments] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE status = "Confirmed" AND appointment_date >= ?',
      [today]
    );
    
    // Get active patients count
    const [activePatients] = await pool.query(
      'SELECT COUNT(*) as count FROM patients'
    );
    
    // Get upcoming appointments
    const [upcomingAppointments] = await pool.query(
      `SELECT a.id, a.appointment_time as time, a.appointment_date as date, 
       a.reason as type, p.name as patient 
       FROM appointments a 
       JOIN patients p ON a.patient_id = p.id 
       WHERE a.appointment_date = ? 
       ORDER BY a.appointment_time 
       LIMIT 3`,
      [today]
    );
    
    // Get recent activities
    const [recentActivities] = await pool.query(
      'SELECT * FROM activities ORDER BY created_at DESC LIMIT 4'
    );
    
    // Get alerts
    const [alerts] = await pool.query(
      'SELECT * FROM alerts ORDER BY priority DESC LIMIT 3'
    );
    
    res.json({
      stats: {
        appointmentsToday: appointmentsToday[0].count,
        pendingAppointments: pendingAppointments[0].count,
        activePatients: activePatients[0].count,
        satisfactionRate: "98%" // Hardcoded for now
      },
      upcomingAppointments,
      recentActivities,
      alerts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Patients routes
app.get('/api/patients', async (req, res) => {
  try {
    const [patients] = await pool.query('SELECT * FROM patients');
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [patients] = await pool.query('SELECT * FROM patients WHERE id = ?', [id]);
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patients[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { name, age, gender, condition, status } = req.body;
    const [result] = await pool.query(
      'INSERT INTO patients (name, age, gender, condition, status) VALUES (?, ?, ?, ?, ?)',
      [name, age, gender, condition, status]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      age,
      gender,
      condition,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, condition, status } = req.body;
    
    await pool.query(
      'UPDATE patients SET name = ?, age = ?, gender = ?, condition = ?, status = ? WHERE id = ?',
      [name, age, gender, condition, status, id]
    );
    
    res.json({ 
      id,
      name,
      age,
      gender,
      condition,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Appointments routes
app.get('/api/appointments', async (req, res) => {
  try {
    const { date } = req.query;
    let query = `
      SELECT a.*, p.name as patientName 
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id
    `;
    
    const params = [];
    if (date) {
      query += ' WHERE a.appointment_date = ?';
      params.push(date);
    }
    
    query += ' ORDER BY a.appointment_time';
    
    const [appointments] = await pool.query(query, params);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { 
      patient_id, 
      appointment_date, 
      appointment_time, 
      duration, 
      type, 
      status, 
      reason 
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO appointments 
       (patient_id, appointment_date, appointment_time, duration, type, status, reason) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, appointment_date, appointment_time, duration, type, status, reason]
    );
    
    // Get the patient name for the response
    const [patients] = await pool.query('SELECT name FROM patients WHERE id = ?', [patient_id]);
    
    res.status(201).json({ 
      id: result.insertId,
      patient_id,
      patientName: patients[0].name,
      appointment_date,
      appointment_time,
      duration,
      type,
      status,
      reason
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Emergency management routes
app.get('/api/patients/:id/emergency', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get crisis protocol
    const [protocols] = await pool.query(
      'SELECT * FROM crisis_protocols WHERE patient_id = ?',
      [id]
    );
    
    // Get emergency contacts
    const [contacts] = await pool.query(
      'SELECT * FROM emergency_contacts WHERE patient_id = ?',
      [id]
    );
    
    // Get behavior journal
    const [journal] = await pool.query(
      'SELECT * FROM behavior_journal WHERE patient_id = ? ORDER BY event_date DESC',
      [id]
    );
    
    res.json({
      crisisProtocol: protocols.length > 0 ? protocols[0] : null,
      emergencyContacts: contacts,
      behaviorJournal: journal
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Crisis protocol routes
app.post('/api/patients/:id/crisis-protocol', async (req, res) => {
  try {
    const { id } = req.params;
    const { calm_space, soothing_object, other_strategies } = req.body;
    
    // Check if protocol exists
    const [existing] = await pool.query(
      'SELECT * FROM crisis_protocols WHERE patient_id = ?',
      [id]
    );
    
    if (existing.length > 0) {
      // Update existing protocol
      await pool.query(
        `UPDATE crisis_protocols 
         SET calm_space = ?, soothing_object = ?, other_strategies = ? 
         WHERE patient_id = ?`,
        [calm_space, soothing_object, other_strategies, id]
      );
    } else {
      // Create new protocol
      await pool.query(
        `INSERT INTO crisis_protocols 
         (patient_id, calm_space, soothing_object, other_strategies) 
         VALUES (?, ?, ?, ?)`,
        [id, calm_space, soothing_object, other_strategies]
      );
    }
    
    res.status(201).json({
      patient_id: id,
      calm_space,
      soothing_object,
      other_strategies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Emergency contacts routes
app.post('/api/patients/:id/emergency-contacts', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, relation } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO emergency_contacts 
       (patient_id, name, phone, relation) 
       VALUES (?, ?, ?, ?)`,
      [id, name, phone, relation]
    );
    
    res.status(201).json({
      id: result.insertId,
      patient_id: id,
      name,
      phone,
      relation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/emergency-contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM emergency_contacts WHERE id = ?', [id]);
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Behavior journal routes
app.post('/api/patients/:id/behavior-journal', async (req, res) => {
  try {
    const { id } = req.params;
    const { event_date, trigger, solution, duration } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO behavior_journal 
       (patient_id, event_date, trigger, solution, duration) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, event_date, trigger, solution, duration]
    );
    
    res.status(201).json({
      id: result.insertId,
      patient_id: id,
      event_date,
      trigger,
      solution,
      duration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/behavior-journal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM behavior_journal WHERE id = ?', [id]);
    
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

////////////////////////////////////
//  4) Start Server
////////////////////////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n[OK] Server is running on port ${PORT}\n`);
});