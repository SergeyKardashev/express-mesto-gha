const cardsRouter = require('express').Router();
const {
  // celebrate,
  // Joi,
  errors,
  // Segments,
} = require('celebrate');
// const urlRegExp = require('../constants/reg-exp-url');
const {
  createCard,
  getAllCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateLikeCard,
  validateDislikeCard,
  validateDeleteCard,
} = require('../validators/celebrate-validators');

// отключил в дочерних роутерах тк есть в точке входа
// const auth = require('../middlewares/auth');
// cardsRouter.use(auth);

// cardsRouter.use(celebrate({
//   [Segments.PARAMS]: Joi.object().keys({
//     cardId: Joi.string().alphanum().length(24),
//     name: Joi.string().min(2).max(30),
//     link: Joi.string().min(2).max(30)
//       .pattern(/^(https?:\/\/)?(www\.)?[\w-]+\.\w{2,}(\/[\w-]+)*\/?$/),
//   }),
// }));

// function validateCardNameLink() {
//   return celebrate({
//     [Segments.BODY]: Joi.object().keys({
//       name: Joi.string().required().min(2).max(30),
//       link: Joi.string().required().pattern(urlRegExp),
//     }),
//   });
// }

// function validateCardId() {
//   return celebrate({
//     [Segments.PARAMS]: Joi.object().keys({
//       cardId: Joi.string().alphanum().length(24),
//     }),
//   });
// }

// в appRouter прописал что роуты, начинающиеся с /users обрабатываются этим usersRouter
cardsRouter.post('/', validateCreateCard, createCard);
cardsRouter.get('/', getAllCards);
cardsRouter.put('/:cardId/likes', validateLikeCard, likeCard);
cardsRouter.delete('/:cardId/likes', validateDislikeCard, dislikeCard);
cardsRouter.delete('/:cardId', validateDeleteCard, deleteCard);

cardsRouter.use(errors()); // from celebrate

module.exports = cardsRouter;
