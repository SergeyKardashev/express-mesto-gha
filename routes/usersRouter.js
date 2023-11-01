const usersRouter = require('express').Router();
const { errors } = require('celebrate');
const {
  getUserById, getAllUsers, updateUser, updateAvatar, getCurrentUserById,
} = require('../controllers/users');

const {
  validateUpdateAvatar, validateUpdateUser, validateGetUserById,
} = require('../validators/celebrate-validators');

usersRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
usersRouter.patch('/me', validateUpdateUser, updateUser);
usersRouter.get('/me', getCurrentUserById);
usersRouter.get('/:userId', validateGetUserById, getUserById);
usersRouter.get('/', getAllUsers);

usersRouter.use(errors());

module.exports = usersRouter;
