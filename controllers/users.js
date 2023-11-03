const bcrypt = require('bcrypt');
const User = require('../models/user');
const generateToken = require('../utils/jwt');
const {
  STATUS_CREATED, MONGO_DUPLICATE_ERROR, STATUS_NOT_FOUND,
} = require('../constants/http-status');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const { SALT_ROUNDS = 10 } = process.env;
const opts = { runValidators: true, new: true };

async function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    return res.status(STATUS_CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_ERROR) return next(new ConflictError('Этот email уже используется'));
    if (err.name === 'CastError' || err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    return next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(new UnauthorizedError('Неверные почта или пароль'));

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new UnauthorizedError('Неверные почта или пароль');
    const token = generateToken({ _id: user._id });

    return res
      .cookie('jwt', token, { maxAge: 604800000, httpOnly: true, sameSite: true })
      .send({ email: user.email, _id: user._id, message: 'token in cookie' })
      .end();
  } catch (err) {
    res.clearCookie('jwt');
    return next(err);
  }
}

function getAllUsers(req, res, next) {
  return User.find()
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

function getUserById(req, res, next) {
  return User.findById(req.params.userId)
    .orFail(new NotFoundError('_id не найден'))
    .then((dataFromDB) => res.send({
      userId: dataFromDB._id,
      email: dataFromDB.email,
      name: dataFromDB.name,
      about: dataFromDB.about,
      avatar: dataFromDB.avatar,
    }))
    .catch((err) => {
      if (err.statusCode === 404) return next(new NotFoundError('Пользователь по указанному _id не найден'));
      if (err.name === 'CastError') return next(new BadRequestError('Получение пользователя с некорректным id'));
      return next();
    });
}

function getCurrentUserById(req, res, next) {
  return User.findById(req.user)
    .orFail(new NotFoundError('_id не найден'))
    .then((dataFromDB) => res.send({
      userId: dataFromDB._id,
      email: dataFromDB.email,
      name: dataFromDB.name,
      about: dataFromDB.about,
      avatar: dataFromDB.avatar,
    }))
    .catch((err) => {
      if (err.statusCode === STATUS_NOT_FOUND) return next(new NotFoundError('Пользователь по указанному _id не найден'));
      if (err.name === 'CastError') return next(new BadRequestError('Получение пользователя с некорректным id'));
      return next(err);
    });
}

function updateUser(req, res, next) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .orFail(new NotFoundError())
    .then((dataFromDB) => res.send({
      userId: dataFromDB._id,
      email: dataFromDB.email,
      name: dataFromDB.name,
      about: dataFromDB.about,
      avatar: dataFromDB.avatar,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      if (err.statusCode === STATUS_NOT_FOUND) return next(new NotFoundError('Пользователь с указанным _id не найден'));
      return next(err);
    });
}

function updateAvatar(req, res, next) {
  const id = req.user._id;
  const updateObject = req.body;
  return User.findByIdAndUpdate(id, updateObject, opts)
    .orFail(new NotFoundError())
    .then((avatarData) => res.send({ avatar: avatarData.avatar }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      if (err.statusCode === STATUS_NOT_FOUND) return next(new NotFoundError('Пользователь с указанным _id не найден'));
      return next(err);
    });
}

module.exports = {
  createUser,
  login,
  getUserById,
  getCurrentUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
};
