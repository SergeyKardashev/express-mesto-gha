const jwt = require('jsonwebtoken');
// const {
//   STATUS_UNAUTHORIZED,
//   STATUS_INTERNAL_SERVER_ERROR,
// } = require('../constants/http-status');
const UnauthorizedError = require('../errors/unauthorized-error');

const { JWT_SECRET = 'Secret' } = process.env;

function auth(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new UnauthorizedError('Необходима авторизация');

    const payload = jwt.verify(token, JWT_SECRET);
    // console.log('✅ ПЕЙЛОУД ТОКЕНА ОТПРАВЛЮ В ЗАПРОСЕ через req.user = payload : ', payload);
    req.user = payload;
    return next();
  } catch (error) {
    return next(error);
  }
}

// было утром в понедельник
// function authOnMondayMorning(req, res, next) {
// function auth(req, res, next) {
//   let payload;

//   try {
//     const token = req.cookies.jwt;
//     // console.log('🟡 ТОКЕН в auth ИЗ ЗАПРОСА через req.cookies.jwt: ', token);
//     if (!token) throw new UnauthorizedError('Необходима авторизация');

//     payload = jwt.verify(token, JWT_SECRET);
//     // console.log('✅ ПЕЙЛОАД ТОКЕНА ОТПРАВЛЮ В ЗАПРОСЕ через req.user = payload : ', payload);
//   } catch (error) {
//     next(error);
//   }

//   req.user = payload;
//   return next();
// }

// } catch (error) {
//   if (error.message === 'Требуется авторизация') return res
//       .status(STATUS_UNAUTHORIZED).send({ message: 'Требуется авторизация' });
//   if (error.name === 'JsonWebTokenError') res
//      .status(STATUS_UNAUTHORIZED).send({ message: 'Токен OOPS' });
// return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Дефолтная ошибка' });
// }

// const UnauthorizedError = require('../errors/unauthorized-error');

// function auth(req, res, next) {
//   let payload;
//   try {
//     console.log('заголовки запроса ', req.headers);
//     if (!req.headers.cookie) throw new UnauthorizedError('Необходима авторизация 🟡 1');

//     // 🔴 не работает так. Хотя некоторые так советуют
//     // 🟡 не ясно как быть если в куке окажется не jwt или не только jwt
//     console.log('кука запроса req.headers.cookie.jwt', req.headers.cookie.jwt);

//     const token = req.headers.cookie.replace('jwt=', '');

//     payload = jwt.verify(token, JWT_SECRET);
//   } catch {
//     return next(UnauthorizedError('Необходима авторизация 🟡 🟡 2'));
//     // 🟡🟡 не нужно ли new перед классом ошибки?
//   }
//   req.user = payload;
//   return next(); // 🟡 не уверен что return тут нужен.
// }

module.exports = auth;
