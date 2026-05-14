// api/logout.js
const { cors } = require('./_auth');

module.exports = (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  // JWT is stateless — client just discards the token
  res.json({ ok: true });
};
