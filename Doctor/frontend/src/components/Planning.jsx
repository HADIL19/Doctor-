import React, { useState, useEffect } from "react";

import { createAppointment, getAppointments } from "../services/api";

const Planning = () => {
  const [appointments, setAppointments] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date || !time || !location) {
      alert("Please fill in all fields.");
      return;
    }

    const newAppointment = {
      title,
      date,
      time,
      location,
    };

    try {
      console.log("Sending appointment:", newAppointment);
      await createAppointment(newAppointment);
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      fetchAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Appointment Planning</h2>
      <form onSubmit={handleSubmit} className="mb-6 grid gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Appointment
        </button>
      </form>

      <ul className="space-y-2">
        {appointments.map((appt) => (
          <li key={appt.id} className="border p-2 rounded shadow">
            <strong>{appt.title}</strong> – {appt.date} at {appt.time} ({appt.location})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Planning;
