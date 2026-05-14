// api/products/[uid].js  — handles PUT and DELETE for a single product
const { connectDB, Product } = require('../_models');
const { requireAuth, cors } = require('../_auth');

function docToObj(doc) { const o = doc.toObject(); delete o._id; delete o.__v; return o; }

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;

  const { uid } = req.query;
  await connectDB();

  if (req.method === 'PUT') {
    const doc = await Product.findOneAndUpdate({ uid }, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(docToObj(doc));
  }

  if (req.method === 'DELETE') {
    await Product.findOneAndDelete({ uid });
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
