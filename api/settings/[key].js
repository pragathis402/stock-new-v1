// api/settings/[key].js
const { connectDB, Settings } = require('../_models');
const { requireAuth, cors } = require('../_auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;

  const { key } = req.query;
  await connectDB();

  if (req.method === 'GET') {
    const s = await Settings.findOne({ key });
    return res.json({ value: s ? s.value : null });
  }

  if (req.method === 'POST') {
    const { value } = req.body;
    await Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
