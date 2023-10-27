const usersRouter = require('express').Router();
const {
  // createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
  getCurrentUserById,
} = require('../controllers/users');
// const auth = require('../middlewares/auth');

// Из файла routes/users.js удалите обработчик создания пользователя — он больше не нужен.
// usersRouter.post('/', createUser);

// usersRouter.use(auth);

// в appRouter прописал что роуты, начинающиеся с /users обрабатываются этим usersRouter

usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.patch('/me', updateUser);
usersRouter.get('/me', getCurrentUserById);
usersRouter.get('/:userId', getUserById);
usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
