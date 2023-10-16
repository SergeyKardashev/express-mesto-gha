const Card = require('../models/card');
const checkUserInBase = require('../utils/checkUserInBase');
const handleDefaultError = require('../utils/defaultError');
const checkErrName = require('../utils/checkErrName');

// мидлвара  добавляет в каждый запрос объект user.
// временная middleware дает _id юзера req.user._id

function getAllCards(req, res) {
  Card.find()
    .then((data) => res.status(200).send(data))
    .catch(() => handleDefaultError(res));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id; // 🟡 hardcode
  return Card.create({ name, link, owner })
    .then((cardData) => res.status(200).send(cardData))
    .catch((err) => {
      checkErrName(err, res, 'Переданы некорректные данные при создании карточки');
      return handleDefaultError(res);
    });
}

function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => { checkUserInBase(res, data, 'Передан несуществующий _id карточки'); })
    .catch((err) => {
      checkErrName(err, res, 'Переданы некорректные данные для постановки/снятии лайка');
      return handleDefaultError(res);
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => checkUserInBase(res, data, 'Передан несуществующий _id карточки'))
    .catch((err) => {
      checkErrName(err, res, 'Переданы некорректные данные для постановки/снятии лайка');
      return handleDefaultError(res);
    });
}

function deleteCard(req, res) {
  Card.findByIdAndDelete(req.body.id)
    .then((data) => { checkUserInBase(res, data, 'Карточка с указанным _id не найдена'); })
    .catch(() => handleDefaultError(res));
}
module.exports = {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
