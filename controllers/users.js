// const checkUserInBase = require('../utils/checkUserInBase');
// const handleDefaultError = require('../utils/defaultError');
// const { checkIfValidationError } = require('../utils/checkErrName');
// const checkIfDataFromDB = require('../utils/checkIfDataFromDB');
const User = require('../models/user');
const {
  notFound,
  badRequest,
  ok,
  created,
  InternalServerError,
} = require('../constants/errorCodes');

// tmp мидлвэра добавляет объект user в запросы. req.user._id

const opts = { runValidators: true, new: true };

function getAllUsers(req, res) {
  return User.find()
    .then((data) => res.status(ok).send(data))
    .catch(() => res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' }));
}

function getUserById(req, res) {
  return User.findById(req.params.userId)
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(notFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(ok)
        .send({ name: dataFromDB.name, about: dataFromDB.about, avatar: dataFromDB.avatar });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Получение пользователя с некорректным id' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function createUser(req, res) {
  return User.create(req.body)
  // .then((data) => res.status(created).send(data))
  // чтобы не возвращать лишние поля, возвращаю 3 поля
    .then((dataFromDB) => res.status(created)
      .send({
        name: dataFromDB.name,
        about: dataFromDB.about,
        _id: dataFromDB._id,
      }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function updateUser(req, res) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(ok)
        .send({ name: dataFromDB.name, about: dataFromDB.about });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function updateAvatar(req, res) {
  const id = req.user._id;
  const updateObject = req.body;
  return User.findByIdAndUpdate(id, updateObject, opts)
    .then((dataFromDB) => {
      if (!dataFromDB) {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(ok).send({ avatar: dataFromDB.avatar });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
};
