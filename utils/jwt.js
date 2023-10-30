const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'Secret' } = process.env;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = generateToken;
