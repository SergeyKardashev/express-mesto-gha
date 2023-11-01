const Card = require('../models/card');

const {
  STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_FORBIDDEN,
} = require('../constants/http-status');
const NotFoundError = require('../errors/not-found-error');

function getAllCards(req, res, next) {
  return Card.find()
    .then((dataFromDB) => res.status(STATUS_OK).send(dataFromDB))
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
      if (err.name === 'CastError' || err.name === 'ValidationError') return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      return next(err);
    });
}

function likeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(STATUS_OK).send(dataFromDB))
    .catch((err) => {
      if (err.message === 'Not found') return res.status(STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      if (err.name === 'CastError' || err.name === 'ValidationError') return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      return next(err);
    });
}

function dislikeCard(req, res, next) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(STATUS_OK).send(dataFromDB))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      if (err.message === 'Not found') return res.status(STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      return next(err);
    });
}

async function findCardById(cardId) {
  try {
    const cardData = await Card.findById(cardId)
      .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    return cardData;
  } catch (err) {
    return new NotFoundError('Карточка с указанным _id не найдена');
  }
}

function deleteCard(req, res, next) {
  return findCardById(req.params.cardId)
    .then((foundCardData) => {
      if (!foundCardData.owner.equals(req.user._id)) return res.status(STATUS_FORBIDDEN).send({ message: 'Попытка удалить чужую карточку' });
      return Card.findByIdAndDelete(req.params.cardId)
        .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
        .then((dataFromDB) => res.status(STATUS_OK).send({ _id: dataFromDB._id }));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      if (err.message === 'Not found') res.status(STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
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
