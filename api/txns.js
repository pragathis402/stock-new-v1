// api/txns.js
const { connectDB, Txn } = require('./_models');
const { requireAuth, cors } = require('./_auth');

function docToObj(doc) { const o = doc.toObject(); delete o._id; delete o.__v; return o; }

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const docs = await Txn.find().sort({ ts: 1 });
    return res.json(docs.map(docToObj));
  }

  if (req.method === 'POST') {
    try {
      const doc = await Txn.create(req.body);
      return res.json(docToObj(doc));
    } catch (e) { return res.status(400).json({ error: e.message }); }
  }

  if (req.method === 'DELETE') {
    await Txn.deleteMany({});
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
