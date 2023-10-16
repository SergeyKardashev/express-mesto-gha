module.exports = function handleDefaultError(res) {
  return res.status(500).send({ message: 'Ошибка по умолчанию' });
};
