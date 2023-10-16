const { defaultErr } = require('./errorCodes');

module.exports = function handleDefaultError(res) {
  return res.status(defaultErr).send({ message: 'Ошибка по умолчанию' });
};
