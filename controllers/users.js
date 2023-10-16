const User = require('../models/user');
const checkUserInBase = require('../validators/checkUserInBase');
const handleDefaultError = require('../validators/defaultError');
// const DefaultServerError = require('../errors/defaultServerError');
// const NotFoundDataError = require('../errors/NotFoundDataError');
// const ValidationError = require('../errors/ValidationError');

// tmp мидлвэра добавляет объект user в запросы. req.user._id

const opts = { runValidators: true, new: true };

// ✅ ошибки добавил ✅ проверил
function getAllUsers(req, res) {
  return User.find()
    .then((usersData) => res.status(200).send(usersData))
    .catch(() => handleDefaultError(res));
}

// ✅ ошибки добавил ✅ проверил
function getUserById(req, res) {
  // 404 — Пользователь по указанному _id не найден.
  return User.findById(req.params.userId)
    .then((userData) => checkUserInBase(res, userData, 'Пользователь по указанному _id не найден'))
    .catch(() => handleDefaultError(res));
}

// ✅ ошибки добавил ✅ проверил
function createUser(req, res) {
  // 400 — Переданы некорректные данные при создании пользователя.
  return User.create(req.body)
    .then((returnedUserData) => res.status(200).send(returnedUserData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return handleDefaultError(res);
    });
}

// ✅ ошибки добавил ✅ проверил
function updateUser(req, res) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .then((userData) => checkUserInBase(res, userData, 'Пользователь с указанным _id не найден'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return handleDefaultError(res);
    });
}

// ✅ ошибки добавил ✅ проверил
function updateAvatar(req, res) {
  // 400 — Переданы некорректные данные при обновлении аватара.
  // 404 — Пользователь с указанным _id не найден.
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .then((avatarData) => checkUserInBase(res, avatarData, 'Пользователь с указанным _id не найден'))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return handleDefaultError(res);
    });
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
};
