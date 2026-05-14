// api/_models.js  — shared by all serverless functions
const mongoose = require('mongoose');
try { require('dotenv').config(); } catch (_) {}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn('[OilShop] MONGO_URI is not set. API routes will fail until you add it.');
}

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add your MongoDB connection string in environment variables.');
  }
  await mongoose.connect(MONGO_URI);
  isConnected = true;
}

const settingsSchema = new mongoose.Schema({ key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed });
const productSchema  = new mongoose.Schema({ uid: { type: String, unique: true }, name: String, qty: Number, price: Number, alertAt: { type: Number, default: 3 } }, { timestamps: true });
const customerSchema = new mongoose.Schema({ uid: { type: String, unique: true }, name: String, phone: { type: String, default: '' }, balance: { type: Number, default: 0 }, totalPurchased: { type: Number, default: 0 }, totalReturned: { type: Number, default: 0 } }, { timestamps: true });
const txnSchema      = new mongoose.Schema({ uid: { type: String, unique: true }, ts: { type: Number, default: Date.now }, type: String, userId: String, userName: String, product: String, qty: Number, rate: Number, price: Number, total: Number, reason: String, note: String }, { timestamps: true });

module.exports = {
  connectDB,
  Settings: mongoose.models.Settings || mongoose.model('Settings', settingsSchema),
  Product:  mongoose.models.Product  || mongoose.model('Product',  productSchema),
  Customer: mongoose.models.Customer || mongoose.model('Customer', customerSchema),
  Txn:      mongoose.models.Txn      || mongoose.model('Txn',      txnSchema),
};
