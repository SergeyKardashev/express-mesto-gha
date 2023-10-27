const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  notFound,
  badRequest,
  ok,
  created,
  InternalServerError,
  Unauthorized,
} = require('../constants/errorCodes');

const saltRounds = 10;

const { JWT_SECRET = 'Secret' } = process.env;

// tmp middleware добавляет объект user в запросы. req.user._id

const opts = { runValidators: true, new: true };
// const opts = { new: true, runValidators: true };

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Не заполнен email или пароль' });

  return User.findOne({ email })
    .select('+password')
    .orFail(new Error('Not found'))

    .then((userData) => bcrypt.compare(password, userData.password)
      .then((matched) => {
        if (!matched) return Promise.reject(new Error('WRONG PASS'));
        const token = jwt.sign({ _id: userData._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).cookie('jwt', token, { httpOnly: true }).send('token in cookie').end();
      }))
    .catch((err) => {
      if (err.message === 'Not found' || err.message === 'WRONG PASS') return res.status(Unauthorized).send({ message: 'Неправильные почта или пароль' });
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function getAllUsers(req, res) {
  return User.find()
    .then((data) => res.status(ok).send(data))
    .catch(() => res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' }));
}

// 🟡 новая
function getCurrentUserById(req, res) {
  return User.findById(req.user) // 🟡 пока это единственная измененная строка
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(ok)
      .send({ name: dataFromDB.name, about: dataFromDB.about, avatar: dataFromDB.avatar }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Получение пользователя с некорректным id' });
      }
      if (err.message === 'Not found') {
        return res.status(notFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function getUserById(req, res) {
  return User.findById(req.params.userId)
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(ok)
      .send({ name: dataFromDB.name, about: dataFromDB.about, avatar: dataFromDB.avatar }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Получение пользователя с некорректным id' });
      }
      if (err.message === 'Not found') {
        return res.status(notFound).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function createUser(req, res) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((dataFromDB) => res.status(created).send({
      email: dataFromDB.email,
      password: dataFromDB.password,
      name: dataFromDB.name,
      about: dataFromDB.about,
      avatar: dataFromDB.avatar,
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
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(ok).send({ name: dataFromDB.name, about: dataFromDB.about }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.message === 'Not found') {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(InternalServerError).send({ message: 'Ошибка по умолчанию' });
    });
}

function updateAvatar(req, res) {
  const id = req.user._id;
  const updateObject = req.body;
  return User.findByIdAndUpdate(id, updateObject, opts)
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(ok).send({ avatar: dataFromDB.avatar }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.message === 'Not found') {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найден' });
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
  login,
  getCurrentUserById,
};
