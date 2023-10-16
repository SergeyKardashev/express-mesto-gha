const usersRouter = require('express').Router();
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// в appRouter прописал что роуты, начинающиеся с /users обрабатываются этим usersRouter

usersRouter.post('/', createUser);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.patch('/me', updateUser);
usersRouter.get('/:userId', getUserById);
usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
