const {
  celebrate,
  Joi,
  // errors, // оставил в роутере
  // Segments, // не использую больше 1 сегмента
} = require('celebrate');

const urlRegExp = require('../constants/reg-exp-url');

module.exports.validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp),
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

module.exports.validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegExp),
  }),
});

module.exports.validateLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

module.exports.validateDislikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

module.exports.validateDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
});

// решил для каждой функции делать свой валидатор
// module.exports.idValidator = celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().alphanum().length(24),
//   }),
// });

// module.exports = {
//   validateUpdateAvatar,
//   validateCreateCard,
//   validateLikeCard,
//   validateDislikeCard,
//   validateDeleteCard,
// };
