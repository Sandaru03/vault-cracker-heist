const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cyber_vault_agent_secret_key_2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Infiltration credentials missing (No token provided).'
    });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.agent = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid or expired cyber token.'
    });
  }
}

module.exports = {
  verifyToken,
  JWT_SECRET
};
