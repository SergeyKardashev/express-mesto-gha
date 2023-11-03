const Card = require('../models/card');

const { STATUS_CREATED } = require('../constants/http-status');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

function getAllCards(req, res, next) {
  return Card.find()
    .then((dataFromDB) => res.send(dataFromDB))
    .catch(next);
}

function createCard(req, res, next) {
  return Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((dataFromDB) => res.status(STATUS_CREATED)
      .send({
        name: dataFromDB.name,
        link: dataFromDB.link,
        _id: dataFromDB._id,
      }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => {
      if (err.message === 'Not found') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.send(dataFromDB))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else if (err.message === 'Not found') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
}

async function findCardById(cardId) {
  const cardData = await Card.findById(cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
  return cardData;
}

function deleteCard(req, res, next) {
  return findCardById(req.params.cardId)
    .then((foundCardData) => {
      if (!foundCardData.owner.equals(req.user._id)) {
        next(new ForbiddenError('Попытка удалить чужую карточку'));
      }
      return Card.findByIdAndDelete(req.params.cardId)
        .then((dataFromDB) => res.send({ _id: dataFromDB._id }));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.message === 'Not found') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return next(err);
    });
}

module.exports = {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
