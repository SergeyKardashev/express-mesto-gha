const usersRouter = require('express').Router();
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.post('/users', createUser);
usersRouter.patch('/users/me/avatar', updateAvatar);
usersRouter.patch('/users/me', updateUser);
usersRouter.get('/users/:userId', getUserById);
usersRouter.get('/users', getAllUsers);

module.exports = usersRouter;
