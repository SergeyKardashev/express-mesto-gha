const User = require('../models/user');
// const DefaultServerError = require('../errors/defaultServerError');
// const NotFoundDataError = require('../errors/NotFoundDataError');
// const ValidationError = require('../errors/ValidationError');

// временная middleware дает _id юзера
// req.user._id

const opts = { runValidators: true, new: true };

// ✅ ошибки проверил
function checkUserInBase(res, user, message) {
  if (!user) {
    return res.status(404).send({ message });
  }
  return res.status(200).send(user);
}

// ✅ ошибки проверил
function createUser(req, res) {
  return User.create(req.body)
    .then((returnedUserData) => res.status(200).send(returnedUserData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
}

// ✅ ошибки проверил
function getUserById(req, res) {
  const { userId } = req.params;
  const message = 'Пользователь по указанному _id не найден';
  return User.findById(userId)
    .then((user) => checkUserInBase(res, user, message))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
}

// ✅ ошибки проверил
function getAllUsers(req, res) {
  return User.find()
    .then((usersData) => res.status(200).send(usersData))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
}

// ✅ ошибки проверил
function updateUser(req, res) {
  const message = 'Пользователь с указанным _id не найден';
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .then((user) => checkUserInBase(res, user, message))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
}

// ✅ ошибки проверил
function updateAvatar(req, res) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .then((returnedAvatarData) => checkUserInBase(res, returnedAvatarData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
};
