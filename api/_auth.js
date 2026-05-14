// api/_auth.js — JWT helpers shared by all functions
const jwt = require('jsonwebtoken');
const SECRET = process.env.SESSION_SECRET || 'oilshop-secret';

function signToken() {
  return jwt.sign({ loggedIn: true }, SECRET, { expiresIn: '8h' });
}

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return false;
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch { return false; }
}

function requireAuth(req, res) {
  if (!verifyToken(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = { signToken, verifyToken, requireAuth, cors };
