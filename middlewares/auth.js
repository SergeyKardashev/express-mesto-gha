const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { JWT_SECRET = 'Secret' } = process.env;

function auth(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new UnauthorizedError('Необходима авторизация');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
}

module.exports = auth;
