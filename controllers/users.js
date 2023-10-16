const User = require('../models/user');
const checkUserInBase = require('../utils/checkUserInBase');
const handleDefaultError = require('../utils/defaultError');
const checkErrName = require('../utils/checkErrName');
const { ok, created } = require('../utils/errorCodes');

// tmp мидлвэра добавляет объект user в запросы. req.user._id

const opts = { runValidators: true, new: true };

function getAllUsers(req, res) {
  return User.find()
    .then((data) => res.status(ok).send(data))
    .catch(() => handleDefaultError(res));
}

function getUserById(req, res) {
  return User.findById(req.params.userId)
    .then((data) => checkUserInBase(res, data, 'Пользователь по указанному _id не найден'))
    .catch(() => handleDefaultError(res));
}

function createUser(req, res) {
  return User.create(req.body)
    .then((data) => res.status(created).send(data))
    .catch((err) => {
      checkErrName(err, res, 'Переданы некорректные данные при создании пользователя');
      return handleDefaultError(res);
    });
}

function updateUser(req, res) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .then((userData) => checkUserInBase(res, userData, 'Пользователь с указанным _id не найден'))
    .catch((err) => {
      checkErrName(err, res, 'Переданы некорректные данные при обновлении профиля');
      return handleDefaultError(res);
    });
}

function updateAvatar(req, res) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .then((avatarData) => checkUserInBase(res, avatarData, 'Пользователь с указанным _id не найден'))
    .catch((err) => {
      checkErrName(err, res, 'Переданы некорректные данные при обновлении аватара');
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
