const cardsRouter = require('express').Router();
const {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

// в мегароутере appRouter в routes/index.js прописано
// что все роуты, начинающиеся с /cards обрабатываются
// роутером cardsRouter (этот)

cardsRouter.post('/', createCard);
cardsRouter.get('/', getAllCards);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);
cardsRouter.delete('/:cardId', deleteCard);

module.exports = cardsRouter;
