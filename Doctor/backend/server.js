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









////////////////////////////////////
//  4) Start Server
////////////////////////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n[OK] Server is running on port ${PORT}\n`);
});
