const userRouter = require('express').Router();
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.post('/users', createUser);
userRouter.patch('/users/me/avatar', updateAvatar);
userRouter.patch('/users/me', updateUser);
userRouter.get('/users/:userId', getUserById);
userRouter.get('/users', getAllUsers);

module.exports = userRouter;
