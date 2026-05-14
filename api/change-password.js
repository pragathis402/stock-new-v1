// api/change-password.js
const bcrypt = require('bcryptjs');
const { connectDB, Settings } = require('./_models');
const { requireAuth, cors } = require('./_auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'New password required' });

  try {
    await connectDB();
    const hash = await bcrypt.hash(newPassword, 10);
    await Settings.findOneAndUpdate({ key: 'password' }, { value: hash }, { upsert: true });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
