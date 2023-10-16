const Card = require('../models/card');
const checkUserInBase = require('../validators/checkUserInBase');
const handleDefaultError = require('../validators/defaultError');

// мидлвара  добавляет в каждый запрос объект user.
// временная middleware дает _id юзера req.user._id

// ✅ ошибки добавил, ✅ проверил
function getCards(req, res) {
  Card.find()
    .then((сardsData) => res.status(200).send(сardsData))
    .catch(() => handleDefaultError(res));
}

// ✅ ошибки добавил, ✅ проверил
function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id; // 🟡 hardcode
  return Card.create({ name, link, owner })
    .then((cardData) => res.status(200).send(cardData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return handleDefaultError(res);
    });
}

// ✅ ошибки добавил, 🟡 есть нюанс
function likeCard(req, res) {
  // 🟡 не ясно какие данные можно передать неверные чтобы получить 400
  // 🟡 не ошибка если айди юзера липовый.
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => { checkUserInBase(res, data, 'Передан несуществующий _id карточки'); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return handleDefaultError(res);
    });
}

// ✅ ошибки добавил, 🟡 есть нюанс
function dislikeCard(req, res) {
  // 🟡 не ясно какие данные можно передать неверные чтобы получить 400
  // 🟡 не ошибка если неверный айди ЮЗЕРА
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => checkUserInBase(res, data, 'Передан несуществующий _id карточки'))
    .catch(() => handleDefaultError(res));
}

// ✅ ошибки добавил, ✅ проверил
function deleteCard(req, res) {
  // 404 — Карточка с указанным _id не найдена.
  Card.findByIdAndDelete(req.body.id)
    .then((data) => { checkUserInBase(res, data, 'Карточка с указанным _id не найдена'); })
    .catch(() => handleDefaultError(res));
}
module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
