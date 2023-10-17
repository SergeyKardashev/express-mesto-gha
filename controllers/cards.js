const Card = require('../models/card');
const {
  notFound,
  badRequest,
  ok,
  created,
  InternalServerError,
} = require('../constants/errorCodes');

// tmp мидлвэра добавляет объект user в запросы. req.user._id

function getAllCards(req, res) {
  Card.find()
    .then((dataFromDB) => res.status(ok).send(dataFromDB))
    .catch(() => res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' }));
}

function createCard(req, res) {
  return Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((dataFromDB) => res.status(created)
      .send({
        name: dataFromDB.name,
        link: dataFromDB.link,
        _id: dataFromDB._id,
      }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(ok)
        .send({
          name: dataFromDB.name,
          about: dataFromDB.about,
        });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(notFound).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(ok)
        .send({ name: dataFromDB.name, about: dataFromDB.about });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndDelete(req.params.cardId)
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(notFound).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(ok).send({ _id: dataFromDB._id });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}
module.exports = {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
