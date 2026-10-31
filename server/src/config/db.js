const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vault_cracker_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database schema if tables do not exist
async function initDatabase() {
  let connection;
  try {
    // First connect without database selected to ensure database exists
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await connection.changeUser({ database: dbConfig.database });

    // Create agents table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`agents\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        \`full_name\` VARCHAR(100) NOT NULL,
        \`nick_name\` VARCHAR(50) NOT NULL,
        \`email\` VARCHAR(120) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create agent_stats table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`agent_stats\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        \`agent_id\` INT(11) NOT NULL,
        \`score\` INT(11) DEFAULT 0,
        \`unlocked_badges\` VARCHAR(50) DEFAULT 'NONE',
        \`last_login\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_agent_id\` (\`agent_id\`),
        CONSTRAINT \`fk_agent_stats_agent\` FOREIGN KEY (\`agent_id\`) REFERENCES \`agents\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('[DB] Database schema verified and initialized successfully.');
  } catch (error) {
    console.error('[DB] Database initialization error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = {
  pool,
  initDatabase
};

