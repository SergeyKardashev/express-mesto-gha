const { STATUS_INTERNAL_SERVER_ERROR } = require('../constants/http-status');

function errorHandler(err, req, res, next) {
  console.log('В ГЛОБАЛЬНОМ: СТАТУС-КОД ', err.statusCode, 'ИМЯ', err.name, 'СООБЩЕНИЕ', err.message);

  const statusCode = err.statusCode || 500;

  console.log('В ГЛОБАЛЬНОМ: ПЕРЕМЕННАЯ statusCode ', statusCode);

  const message = statusCode === STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка по умолчанию' : err.message;

  res.status(statusCode).send({ message });

  next(); // у хэндлера ошибок нет некста. Он последний из мидлвэр. But linter complains.
}

module.exports = errorHandler;
