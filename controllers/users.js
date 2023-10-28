const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  // STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  // STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../constants/http-status');

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
        return res.status(STATUS_OK).cookie('jwt', token, { httpOnly: true }).send('token in cookie').end();
        // 🟡 может куку встроить в запрос, а не в ответ?
      }))
    .catch((err) => {
      if (err.message === 'Not found' || err.message === 'WRONG PASS') return res.status(STATUS_UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      // 🟡 тут почистить содержимое куки?
    });
}

function getAllUsers(req, res) {
  return User.find()
    .then((data) => res.status(STATUS_OK).send(data))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
}

// 🟡 новая
function getCurrentUserById(req, res) {
  return User.findById(req.user) // 🟡 пока это единственная измененная строка
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(STATUS_OK)
      .send({ name: dataFromDB.name, about: dataFromDB.about, avatar: dataFromDB.avatar }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Получение пользователя с некорректным id' });
      }
      if (err.message === 'Not found') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
}

function getUserById(req, res) {
  return User.findById(req.params.userId)
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(STATUS_OK)
      .send({ name: dataFromDB.name, about: dataFromDB.about, avatar: dataFromDB.avatar }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Получение пользователя с некорректным id' });
      }
      if (err.message === 'Not found') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
}

function createUser(req, res) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, saltRounds)
    // 🟡 хэширую пароль. Передаю много пассажиров. Можно попробовать async await
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    // Возвращаю ответ
    .then((dataFromDB) => res.status(STATUS_CREATED).send({
      email: dataFromDB.email,
      password: dataFromDB.password,
      name: dataFromDB.name,
      about: dataFromDB.about,
      avatar: dataFromDB.avatar,
      _id: dataFromDB._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
}

function updateUser(req, res) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res
      .status(STATUS_OK)
      .send({ name: dataFromDB.name, about: dataFromDB.about }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.message === 'Not found') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
}

function updateAvatar(req, res) {
  const id = req.user._id;
  const updateObject = req.body;
  return User.findByIdAndUpdate(id, updateObject, opts)
    .orFail(new Error('Not found'))
    .then((dataFromDB) => res.status(STATUS_OK).send({ avatar: dataFromDB.avatar }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.message === 'Not found') {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
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
