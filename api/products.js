// api/products.js
const { connectDB, Product } = require('./_models');
const { requireAuth, cors } = require('./_auth');

function docToObj(doc) { const o = doc.toObject(); delete o._id; delete o.__v; return o; }

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;

  await connectDB();

  // GET /api/products
  if (req.method === 'GET') {
    const docs = await Product.find().sort({ createdAt: 1 });
    return res.json(docs.map(docToObj));
  }

  // POST /api/products — create or upsert
  if (req.method === 'POST') {
    const { uid, name, qty, price, alertAt } = req.body;
    try {
      const doc = await Product.findOneAndUpdate(
        { uid }, { uid, name, qty, price, alertAt },
        { upsert: true, new: true }
      );
      return res.json(docToObj(doc));
    } catch (e) { return res.status(400).json({ error: e.message }); }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
