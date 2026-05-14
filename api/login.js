// api/login.js
const bcrypt = require('bcryptjs');
const { connectDB, Settings } = require('./_models');
const { signToken, cors } = require('./_auth');

const DEFAULT_HASH = bcrypt.hashSync('shop123', 10);

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: 'MONGO_URI is missing. Set your MongoDB connection string in environment variables.' });
    }
    await connectDB();
    let setting = await Settings.findOne({ key: 'password' });
    if (!setting) {
      await Settings.create({ key: 'password', value: DEFAULT_HASH });
      setting = { value: DEFAULT_HASH };
    }
    const match = await bcrypt.compare(password, setting.value);
    if (!match) return res.status(401).json({ error: 'Wrong password' });
    const token = signToken();
    res.json({ ok: true, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
