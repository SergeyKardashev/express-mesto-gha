const usersRouter = require('express').Router();
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// в мегароутере appRouter в routes/index.js прописано
// что все роуты, начинающиеся с /users обрабатываются
// роутером usersRouter (этот)

usersRouter.post('/', createUser);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.patch('/me', updateUser);
usersRouter.get('/:userId', getUserById);
usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
