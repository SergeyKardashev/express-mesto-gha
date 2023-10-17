const { InternalServerError } = require('./errorCodes');

module.exports = function handleDefaultError(res) {
  return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
};
