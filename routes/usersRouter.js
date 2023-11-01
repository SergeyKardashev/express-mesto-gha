const usersRouter = require('express').Router();
const {
  // celebrate,  // унес во внешний валидатор
  // Joi,  // унес во внешний валидатор
  errors,
  // Segments,  // унес во внешний валидатор
} = require('celebrate');
// const urlRegExp = require('../constants/reg-exp-url'); // унес во внешний валидатор
const {
  // createUser, // теперь это живет в точке входа в signup
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
  getCurrentUserById,
} = require('../controllers/users');

const {
  validateUpdateAvatar,
  validateUpdateUser,
  validateGetUserById,
} = require('../validators/celebrate-validators');

// отключил в дочерних роутерах тк есть в точке входа
// const auth = require('../middlewares/auth');
// usersRouter.use(auth);

//
// Из файла routes/users.js удалите обработчик создания пользователя — он больше не нужен.
// usersRouter.post('/', createUser);

// в appRouter прописал что роуты, начинающиеся с /users обрабатываются этим usersRouter

// унес во внешний файл
// function validateAvatar() {
//   return celebrate({
//     [Segments.BODY]: Joi.object().keys({
//       avatar: Joi.string().required().pattern(urlRegExp),
//     }),
//   });
// }

usersRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
usersRouter.patch('/me', validateUpdateUser, updateUser);
usersRouter.get('/me', getCurrentUserById); // только токен
usersRouter.get('/:userId', validateGetUserById, getUserById);
usersRouter.get('/', getAllUsers); // только токен

usersRouter.use(errors()); // from celebrate

module.exports = usersRouter;
