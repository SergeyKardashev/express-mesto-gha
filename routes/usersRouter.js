const usersRouter = require('express').Router();
const {
  // createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
  getCurrentUserById,
} = require('../controllers/users');

// в appRouter прописал что роуты, начинающиеся с /users обрабатываются этим usersRouter

// Из файла routes/users.js удалите обработчик создания пользователя — он больше не нужен.
// usersRouter.post('/', createUser);

usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.patch('/me', updateUser);
usersRouter.get('/:userId', getUserById);
usersRouter.get('/me', getCurrentUserById);
usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
