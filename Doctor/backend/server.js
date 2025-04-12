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

// Authentication
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = users[0];
    delete user.password;
    res.json({ user, token: 'sample-token' }); // Replace with JWT in production
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard Summary
app.get('/api/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [[appointmentsToday]] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ?', [today]
    );

    const [[pendingAppointments]] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE status = "Confirmed" AND appointment_date >= ?', [today]
    );

    const [[activePatients]] = await pool.query('SELECT COUNT(*) as count FROM patients');

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

    const [recentActivities] = await pool.query(
      'SELECT * FROM activities ORDER BY created_at DESC LIMIT 4'
    );

    const [alerts] = await pool.query(
      'SELECT * FROM alerts ORDER BY priority DESC LIMIT 3'
    );

    res.json({
      stats: {
        appointmentsToday: appointmentsToday.count,
        pendingAppointments: pendingAppointments.count,
        activePatients: activePatients.count,
        satisfactionRate: "98%"
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

// Patients
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
    if (patients.length === 0) return res.status(404).json({ message: 'Patient not found' });
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
    res.status(201).json({ id: result.insertId, name, age, gender, condition, status });
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
    res.json({ id, name, age, gender, condition, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Appointments
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

app.get('/api/appointments/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const [appointments] = await pool.query(
      'SELECT * FROM appointments WHERE appointment_date = ?', [date]
    );
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
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

    const [patients] = await pool.query('SELECT name FROM patients WHERE id = ?', [patient_id]);

    res.status(201).json({
      id: result.insertId,
      patient_id,
      patientName: patients[0]?.name,
      appointment_date,
      appointment_time,
      duration,
      type,
      status,
      reason
    });
  } catch (err) {
    console.error('Error inserting appointment:', err);
    res.status(500).json({ message: 'Database insert error' });
  }
});

// Emergency & Behavior Journal
app.get('/api/patients/:id/emergency', async (req, res) => {
  try {
    const { id } = req.params;
    const [protocols] = await pool.query('SELECT * FROM crisis_protocols WHERE patient_id = ?', [id]);
    const [contacts] = await pool.query('SELECT * FROM emergency_contacts WHERE patient_id = ?', [id]);
    const [journal] = await pool.query('SELECT * FROM behavior_journal WHERE patient_id = ? ORDER BY event_date DESC', [id]);
    res.json({
      crisisProtocol: protocols[0] || null,
      emergencyContacts: contacts,
      behaviorJournal: journal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/patients/:id/crisis-protocol', async (req, res) => {
  try {
    const { id } = req.params;
    const { calm_space, soothing_object, other_strategies } = req.body;
    const [existing] = await pool.query('SELECT * FROM crisis_protocols WHERE patient_id = ?', [id]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE crisis_protocols
         SET calm_space = ?, soothing_object = ?, other_strategies = ?
         WHERE patient_id = ?`,
        [calm_space, soothing_object, other_strategies, id]
      );
    } else {
      await pool.query(
        `INSERT INTO crisis_protocols (patient_id, calm_space, soothing_object, other_strategies)
         VALUES (?, ?, ?, ?)`,
        [id, calm_space, soothing_object, other_strategies]
      );
    }

    res.status(201).json({ patient_id: id, calm_space, soothing_object, other_strategies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/patients/:id/emergency-contacts', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, relation } = req.body;

    const [result] = await pool.query(
      `INSERT INTO emergency_contacts (patient_id, name, phone, relation)
       VALUES (?, ?, ?, ?)`,
      [id, name, phone, relation]
    );

    res.status(201).json({ id: result.insertId, patient_id: id, name, phone, relation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/emergency-contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM emergency_contacts WHERE id = ?', [id]);
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/patients/:id/behavior-journal', async (req, res) => {
  try {
    const { id } = req.params;
    const { event_date, trigger, solution, duration } = req.body;

    const [result] = await pool.query(
      `INSERT INTO behavior_journal (patient_id, event_date, trigger, solution, duration)
       VALUES (?, ?, ?, ?, ?)`,
      [id, event_date, trigger, solution, duration]
    );

    res.status(201).json({ id: result.insertId, patient_id: id, event_date, trigger, solution, duration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/behavior-journal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM behavior_journal WHERE id = ?', [id]);
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (err) {
    console.error(err);
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
