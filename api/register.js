// api/register.js
const bcrypt = require('bcryptjs');
const { connectDB, Settings } = require('./_models');
const { cors } = require('./_auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body;

  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }

  try {
    await connectDB();
    const hash = await bcrypt.hash(password, 10);
    await Settings.findOneAndUpdate(
      { key: 'password' },
      { value: hash },
      { upsert: true }
    );

    res.json({ ok: true, message: 'New user created successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
