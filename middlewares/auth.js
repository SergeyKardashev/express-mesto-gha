// мидлвэр для авторизации. Он должен верифицировать токен из заголовков.
// Если с токеном всё ok, мидлвэр должен добавлять пейлоуд токена в объект запроса и вызывать next

// req.user = payload;
// next();

// Если с токеном что-то не так, мидлвэр должен вернуть ошибку 401

const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../constants/errorCodes');

const { JWT_SECRET = 'Secret' } = process.env;

function auth(req, res, next) {
  // console.log('ЗАГОЛОВКИ: ', req.headers);
  // console.log('КУКА is ', req.headers.cookie);
  if (!req.headers.cookie) return res.status(Unauthorized).send({ message: 'Необходима авторизация' });

  // console.log('КУКА НАЙДЕНА. ИДУ ДАЛЬШЕ');
  const jwtCookie = req.headers.cookie;
  // console.log('ГРЯЗНЫЙ ТОКЕН ', jwtCookie); // jwt=eyJhbGciOiJ

  const token = jwtCookie.replace('jwt=', '');
  // console.log('ЧИСТЫЙ ТОКЕН ', token); // eyJhbGciOiJIU

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    // console.log('ПОЛЕЗНАЯ НАГРУЗКА ТОКЕНА', payload);
    // { _id: '6537c0502a264a2533442b39', iat: 1698328595, exp: 1698933395 }
  } catch (err) {
    return res.status(Unauthorized).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next(); // 🟡 не уверен что return тут нужен.
  // return; // 🟡 Явный в конце функции вернет undefined, a не значение. Линтер ругнется.
}

module.exports = auth;
