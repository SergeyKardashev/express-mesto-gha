const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { JWT_SECRET = 'Secret' } = process.env;

function auth(req, res, next) {
  let payload;
  try {
    console.log('заголовки запроса ', req.headers);
    if (!req.headers.cookie) throw new UnauthorizedError('Необходима авторизация 🟡 1');

    // 🔴 не работает так. Хотя некоторые так советуют
    // 🟡 не ясно как быть если в куке окажется не jwt или не только jwt
    console.log('кука запроса req.headers.cookie.jwt', req.headers.cookie.jwt);

    const token = req.headers.cookie.replace('jwt=', '');

    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return next(UnauthorizedError('Необходима авторизация 🟡 🟡 2'));
    // 🟡🟡 не нужно ли new перед классом ошибки?
  }
  req.user = payload;
  return next(); // 🟡 не уверен что return тут нужен.
}

module.exports = auth;
