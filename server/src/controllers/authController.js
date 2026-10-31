const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Register a new Agent
 * Fields: full_name (or name), nick_name, email, password, confirm_password
 */
async function register(req, res) {
  try {
    const fullName = req.body.full_name || req.body.name;
    const nickName = req.body.nick_name || req.body.nickname;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password || req.body.confirmPassword;

    // 1. Validation: Empty field checks
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Agent full name is required.' });
    }
    if (!nickName || !nickName.trim()) {
      return res.status(400).json({ success: false, message: 'Tactical nick name is required.' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Agent email address is required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid cyber comms email format.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Security password is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and Confirm Password do not match.' });
    }

    // 2. Check if agent already exists
    const [existingAgents] = await pool.query(
      'SELECT id FROM agents WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingAgents.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Agent email is already registered in the syndicate database.'
      });
    }

    // 3. Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Insert into agents table
    const [insertResult] = await pool.query(
      'INSERT INTO agents (full_name, nick_name, email, password_hash) VALUES (?, ?, ?, ?)',
      [fullName.trim(), nickName.trim(), email, passwordHash]
    );

    const agentId = insertResult.insertId;

    // 5. Initialize agent_stats record
    await pool.query(
      'INSERT INTO agent_stats (agent_id, score, unlocked_badges) VALUES (?, 0, ?)',
      [agentId, 'NONE']
    );

    // 6. Generate Session Token
    const token = jwt.sign(
      { id: agentId, email, nick_name: nickName.trim() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const agentData = {
      id: agentId,
      full_name: fullName.trim(),
      nick_name: nickName.trim(),
      email,
      score: 0,
      unlocked_badges: 'NONE'
    };

    return res.status(201).json({
      success: true,
      message: `Agent [${nickName.trim()}] registered and initialized successfully.`,
      token,
      agent: agentData
    });
  } catch (error) {
    console.error('[AUTH REGISTER ERROR]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal syndicate server error during agent registration.'
    });
  }
}

/**
 * Login Agent
 * Fields: email, password
 */
async function login(req, res) {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;

    // 1. Validation
    if (!email) {
      return res.status(400).json({ success: false, message: 'Agent email is required.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Security password is required.' });
    }

    // 2. Fetch agent with stats
    const [rows] = await pool.query(
      `SELECT a.id, a.full_name, a.nick_name, a.email, a.password_hash, 
              COALESCE(s.score, 0) as score, COALESCE(s.unlocked_badges, 'NONE') as unlocked_badges
       FROM agents a
       LEFT JOIN agent_stats s ON a.id = s.agent_id
       WHERE a.email = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Infiltration Failed: Agent identity not found in syndicate records.'
      });
    }

    const agent = rows[0];

    // 3. Verify password hash
    const isMatch = await bcrypt.compare(password, agent.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Infiltration Failed: Invalid security credentials (password mismatch).'
      });
    }

    // 4. Update last_login in agent_stats
    await pool.query(
      'UPDATE agent_stats SET last_login = CURRENT_TIMESTAMP WHERE agent_id = ?',
      [agent.id]
    );

    // 5. Generate Session Token
    const token = jwt.sign(
      { id: agent.id, email: agent.email, nick_name: agent.nick_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const agentData = {
      id: agent.id,
      full_name: agent.full_name,
      nick_name: agent.nick_name,
      email: agent.email,
      score: agent.score,
      unlocked_badges: agent.unlocked_badges
    };

    return res.status(200).json({
      success: true,
      message: `Access Granted. Welcome Agent [${agent.nick_name}]!`,
      token,
      agent: agentData
    });
  } catch (error) {
    console.error('[AUTH LOGIN ERROR]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal syndicate server error during agent authentication.'
    });
  }
}

/**
 * Get current authenticated agent profile (session verification)
 */
async function getMe(req, res) {
  try {
    const agentId = req.agent.id;

    const [rows] = await pool.query(
      `SELECT a.id, a.full_name, a.nick_name, a.email, a.created_at,
              COALESCE(s.score, 0) as score, COALESCE(s.unlocked_badges, 'NONE') as unlocked_badges,
              s.last_login
       FROM agents a
       LEFT JOIN agent_stats s ON a.id = s.agent_id
       WHERE a.id = ?
       LIMIT 1`,
      [agentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Agent record not found.'
      });
    }

    const agent = rows[0];

    return res.status(200).json({
      success: true,
      agent: {
        id: agent.id,
        full_name: agent.full_name,
        nick_name: agent.nick_name,
        email: agent.email,
        score: agent.score,
        unlocked_badges: agent.unlocked_badges,
        created_at: agent.created_at,
        last_login: agent.last_login
      }
    });
  } catch (error) {
    console.error('[AUTH GET_ME ERROR]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve agent session data.'
    });
  }
}

/**
 * Logout
 */
function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Agent session terminated. Encryption keys wiped.'
  });
}

module.exports = {
  register,
  login,
  getMe,
  logout
};

