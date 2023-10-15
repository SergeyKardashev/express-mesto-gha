const Card = require('../models/card');

// мидлвара  добавляет в каждый запрос объект user.
// Берите из него идентификатор пользователя в контроллере создания карточки
// console.log('user._id from request is ', req.user._id); // _id станет доступен

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id; // 🟡 hardcode
  return Card.create({ name, link, owner })
    .then((cardData) => res.status(200).send(cardData))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
}

function getCards(req, res) {
  Card.find()
    .then((returdedCardsData) => res.status(200).send(returdedCardsData))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
}

// поставить лайк карточке
function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
}

// Убрать лайк с карточки
function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
}

function deleteCard(req, res) {
  const cardId = req.body.id;
  console.log('cardId', cardId);
  Card.findByIdAndDelete(cardId)
    .then((returdedCardData) => res.status(200).send(returdedCardData))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
}
module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
