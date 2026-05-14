// api/auth.js
const { verifyToken, cors } = require('./_auth');

module.exports = (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.json({ loggedIn: verifyToken(req) });
};
