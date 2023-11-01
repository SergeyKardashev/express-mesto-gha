const cardsRouter = require('express').Router();
const { errors } = require('celebrate');
const {
  createCard, getAllCards, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

const {
  validateCreateCard, validateLikeCard, validateDislikeCard, validateDeleteCard,
} = require('../validators/celebrate-validators');

cardsRouter.post('/', validateCreateCard, createCard);
cardsRouter.get('/', getAllCards);
cardsRouter.put('/:cardId/likes', validateLikeCard, likeCard);
cardsRouter.delete('/:cardId/likes', validateDislikeCard, dislikeCard);
cardsRouter.delete('/:cardId', validateDeleteCard, deleteCard);

cardsRouter.use(errors());

module.exports = cardsRouter;
