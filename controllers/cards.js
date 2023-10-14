const CardModel = require('../models/card');

// мидлвара  добавляет в каждый запрос объект user.
// Берите из него идентификатор пользователя в контроллере создания карточки

function createCard(req, res) {
  // console.log('user._id from request is ', req.user._id); // _id станет доступен
  const cardData = req.body;

  CardModel.create(cardData)
    .then((returdedCardData) => res.status(200).send(returdedCardData))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
}

function getCards(req, res) {
  CardModel.find()
    .then((returdedCardsData) => res.status(200).send(returdedCardsData))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
}

function deleteCard(req, res) {
  const cardId = req.body.id;
  console.log('cardId', cardId);
  CardModel.findByIdAndDelete(cardId)
    .then((returdedCardData) => res.status(200).send(returdedCardData))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: 'Server Error' });
    });
}
module.exports = { createCard, getCards, deleteCard };
