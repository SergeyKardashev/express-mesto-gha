const cardsRouter = require('express').Router();
const {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

cardsRouter.post('/cards', createCard);
cardsRouter.get('/cards', getCards);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);
cardsRouter.delete('/cards/:cardId', deleteCard);

module.exports = cardsRouter;
