const User = require('../models/user');
const checkUserInBase = require('../utils/checkUserInBase');
const handleDefaultError = require('../utils/defaultError');
const { ok, created } = require('../utils/errorCodes');
const {
  checkErrName,
  checkIfValidationError,
  checkIfCastErr,
  checkIfDataFromDB,
} = require('../utils/checkErrName');

// tmp мидлвэра добавляет объект user в запросы. req.user._id

const opts = { runValidators: true, new: true };

function getAllUsers(req, res) {
  return User.find()
    .then((data) => res.status(ok).send(data))
    .catch(() => handleDefaultError(res));
}

function getUserById(req, res) {
  return User.findById(req.params.userId)
    .then((dataFromDB) => {
      checkIfDataFromDB(res, dataFromDB, 'Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      checkIfCastErr(err, res, 'Получение пользователя с некорректным id');
      checkIfValidationError(err, res, 'Получение пользователя с некорректным id');
      return handleDefaultError(res);
    });
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

// 🟡 new version 🟡 // findByIdAndUpdate(id, updateObject, options)
// подаю req.user._id из мидлвэры. Если ответ БЮ пуст- юзера нет. Из апи шлю только поле АВА
function updateAvatar(req, res) {
  const id = req.user._id;
  const updateObject = req.body;
  return User.findByIdAndUpdate(id, updateObject, opts)
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найде' });
      }
      return res.status(200).send({ avatar: dataFromDB.avatar });
    })
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
