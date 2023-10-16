const Card = require('../models/card');
const checkUserInBase = require('../utils/checkUserInBase');
const handleDefaultError = require('../utils/defaultError');
const checkErrName = require('../utils/checkErrName');
const { ok, created } = require('../utils/errorCodes');

// tmp мидлвэра добавляет объект user в запросы. req.user._id

function getAllCards(req, res) {
  Card.find()
    .then((data) => res.status(ok).send(data))
    .catch(() => handleDefaultError(res));
}

function createCard(req, res) {
  return Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((data) => res.status(created).send(data))
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
