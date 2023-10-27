const cardsRouter = require('express').Router();
const {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');
// const auth = require('../middlewares/auth');

// cardsRouter.use(auth);

// в appRouter прописал что роуты, начинающиеся с /users обрабатываются этим usersRouter
cardsRouter.post('/', createCard);
cardsRouter.get('/', getAllCards);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);
cardsRouter.delete('/:cardId', deleteCard);

module.exports = cardsRouter;
