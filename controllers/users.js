const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const generateToken = require('../utils/jwt');
const {
  STATUS_OK,
  STATUS_CREATED,
  // STATUS_BAD_REQUEST,
  // STATUS_UNAUTHORIZED,
  // STATUS_FORBIDDEN,
  // STATUS_NOT_FOUND,
  // STATUS_CONFLICT,
  // STATUS_INTERNAL_SERVER_ERROR,
  MONGO_DUPLICATE_ERROR,
  STATUS_NOT_FOUND,
} = require('../constants/http-status');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const {
  // JWT_SECRET = 'Secret',
  SALT_ROUNDS = 10,
} = process.env;

const opts = { runValidators: true, new: true };

async function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    // уместен ли тут orFail? это же не обращение к базе
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // .orFail(new Error('oops'));
    // .orFail((err) => {
    //   if (err.code === MONGO_DUPLICATE_ERROR) {
    //     throw new ConflictError('Этот email уже используется');
    //   }
    //   if (err.name === 'CastError' || err.name === 'ValidationError') {
    //     throw new BadRequestError('Переданы некорректные данные при создании пользователя');
    //   }
    // });

    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    return res.status(STATUS_CREATED).send(user);
  } catch (err) {
    // console.log(err);
    console.log('⚪️ В кетче имя ', err.name, ' и СтатусКод ', err.statusCode, 'код (нестатус) ', err.code, 'текст ', err.message);

    if (err.code === MONGO_DUPLICATE_ERROR) {
      return next(new ConflictError('Этот email уже используется'));
    }
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
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
      .status(STATUS_OK)
      .cookie('jwt', token, { maxAge: 604800000, httpOnly: true, sameSite: true })
      .send({ email: user.email, _id: user._id, message: 'token in cookie' }) // ХЗ что передавать
      .end(); //  если есть тело (send), то не нужен end
  } catch (err) {
    res.clearCookie('jwt'); // чищу куку с токеном (одну, а не все), если не смог залогиниться
    return next(err); // отправляю все ошибки в централизованный обработчик
  }
}

function getAllUsers(req, res, next) {
  return User.find()
    .then((data) => res.status(STATUS_OK).send(data))
    .catch((err) => next(err));
}
// До выноса условия из orFail
// function findUserById(userId) {
//   return User.findById(userId)
//     .orFail((err) => {
//       if (err.name === 'CastError') {
//         // Текст идеальный. Просто убрать индикатор
//         throw new BadRequestError('🔴Получение пользователя с некорректным id');
//       }
//       // Текст идеальный. Просто убрать индикатор
//       throw new NotFoundError('🟥Пользователь по указанному _id не найден');
//     });
// }

function getUserById(req, res, next) {
  return User.findById(req.params.userId)
    .orFail(new NotFoundError('_id не найден'))
    .then((dataFromDB) => res.status(STATUS_OK)
      .send({ name: dataFromDB.name, about: dataFromDB.about, avatar: dataFromDB.avatar }))
    .catch((err) => {
      console.log('⚪️ В кетче имя ', err.name, ' и СтатусКод ', err.statusCode, 'текст ', err.message);
      if (err.statusCode === 404) return next(new NotFoundError('Пользователь по указанному _id не найден'));
      if (err.name === 'CastError') return next(new BadRequestError('Получение пользователя с некорректным id'));
      return next();
    });
}
/* Нужна эта проверка? Это отсутствующий ID 652ba4b4451ba72e27d00000, а не Cast Error
// if (err.name === 'ValidationError') {
//   // 🍭🍭🍭 с нулями ломаный ID 652ba4b4451ba72e27d00000
//   return next(new BadRequestError('🍭🍭🍭 ValidationError id'));
// }
*/

// декоратор ?
function getCurrentUserById(req, res, next) {
  return User.findById(req.user)
    .orFail(new NotFoundError('_id не найден'))
    .then((dataFromDB) => res.status(STATUS_OK)
      .send({ name: dataFromDB.name, about: dataFromDB.about, avatar: dataFromDB.avatar }))
    .catch((err) => {
      console.log('⚪️ В кетче имя ', err.name, ' и СтатусКод ', err.statusCode, 'текст ', err.message);
      if (err.statusCode === STATUS_NOT_FOUND) return next(new NotFoundError('Пользователь по указанному _id не найден'));
      if (err.name === 'CastError') return next(new BadRequestError('Получение пользователя с некорректным id'));
      return next();
    });
}

function updateUser(req, res, next) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .orFail(new NotFoundError())
    .then((user) => res.status(STATUS_OK).send({ name: user.name, about: user.about }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.statusCode === STATUS_NOT_FOUND) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      return next(err);
    });
}

function updateAvatar(req, res, next) {
  const id = req.user._id;
  const updateObject = req.body;
  return User.findByIdAndUpdate(id, updateObject, opts)
    .orFail(new NotFoundError())
    .then((avatarData) => res.status(STATUS_OK).send({ avatar: avatarData.avatar }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      if (err.statusCode === STATUS_NOT_FOUND) {
        return next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
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
