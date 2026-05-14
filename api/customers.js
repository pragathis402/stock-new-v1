// api/customers.js
const { connectDB, Customer } = require('./_models');
const { requireAuth, cors } = require('./_auth');

function docToObj(doc) { const o = doc.toObject(); delete o._id; delete o.__v; return o; }

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;

  await connectDB();

  if (req.method === 'GET') {
    const docs = await Customer.find().sort({ createdAt: 1 });
    return res.json(docs.map(docToObj));
  }

  if (req.method === 'POST') {
    const { uid, name, phone, balance, totalPurchased, totalReturned } = req.body;
    try {
      const doc = await Customer.findOneAndUpdate(
        { uid }, { uid, name, phone, balance, totalPurchased, totalReturned },
        { upsert: true, new: true }
      );
      return res.json(docToObj(doc));
    } catch (e) { return res.status(400).json({ error: e.message }); }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
