// мидлвэр для авторизации. Он должен верифицировать токен из заголовков.
// Если с токеном всё ok, мидлвэр должен добавлять пейлоуд токена в объект запроса и вызывать next

// req.user = payload;
// next();

// Если с токеном что-то не так, мидлвэр должен вернуть ошибку 401

const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../constants/errorCodes');

const { JWT_SECRET = 'Secret' } = process.env;

function auth(req, res, next) {
  const jwtCookie = req.headers.cookie;
  const token = jwtCookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(Unauthorized)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next(); // 🟡 не уверен что ретерн тут нужен.
  // 🟡 Explicitly returning to indicate the end of the function
  // return;
}

module.exports = auth;
