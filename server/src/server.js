const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase, pool } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json());

// Routes: Auth and Event-Driven Game Engine
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// System Health Endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'DISCONNECTED';
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    if (rows && rows[0].solution === 2) {
      dbStatus = 'CONNECTED';
    }
  } catch (err) {
    dbStatus = `ERROR: ${err.message}`;
  }

  res.json({
    system: 'Vault Cracker Operational Core',
    status: 'ONLINE',
    port: PORT,
    database: {
      status: dbStatus,
      target: process.env.DB_NAME || 'vault_cracker_db'
    },
    timestamp: new Date().toISOString()
  });
});

// Initialize database and boot server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[VAULT CRACKER] Cyber-Heist Core running on port ${PORT}`);
    console.log(`[VAULT CRACKER] Virtual Identity & Game Engine Active`);
    console.log(`[VAULT CRACKER] Ready for Infiltration`);
    console.log(`====================================================`);
  });
}

startServer();

module.exports = app;
