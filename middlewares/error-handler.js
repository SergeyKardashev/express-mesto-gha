// const {
//   notFound, badRequest, ok, created, InternalServerError, Unauthorized,
// } = require('../constants/errorCodes');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'ДЕФОЛТНАЯ ОШИБКА (ТЕКСТ В МИДЛВЭРЕ ОШИБОК)' : err.message;

  res.status(statusCode).send({ message });

  next();
}

module.exports = errorHandler;
