// api/data.js
const { connectDB, Product, Customer, Txn, Settings } = require('./_models');
const { requireAuth, cors } = require('./_auth');

function docToObj(doc) {
  const obj = doc.toObject();
  delete obj._id; delete obj.__v;
  return obj;
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!requireAuth(req, res)) return;

  try {
    await connectDB();
    const [products, customers, txns, themeSetting] = await Promise.all([
      Product.find().sort({ createdAt: 1 }),
      Customer.find().sort({ createdAt: 1 }),
      Txn.find().sort({ ts: 1 }),
      Settings.findOne({ key: 'theme' }),
    ]);
    res.json({
      products: products.map(docToObj),
      users:    customers.map(docToObj),
      txns:     txns.map(docToObj),
      theme:    themeSetting ? themeSetting.value : 'light',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
