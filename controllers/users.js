const User = require('../models/user');
const checkUserInBase = require('../utils/checkUserInBase');
const handleDefaultError = require('../utils/defaultError');
const checkErrName = require('../utils/checkErrName');
const { ok, notFound, created } = require('../utils/errorCodes');

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

// 🟡 new version 🟡 // findByIdAndUpdate(id, updateObject, options)
// подаю user._id из мидлвэры. Если в ответ пусто, значит юзера нет. В ответ шлю только поле АВА
function updateAvatar(req, res) {
  const id = req.user._id;
  // console.log(' IIIIIII id is ', id); // 652ba457451ba72e27d7043e comes from middleware
  const updateObject = req.body;
  // console.log(' OOOOO newData is', updateObject); // { avatar: '======== +++++++++ +++++++++' }
  return User.findByIdAndUpdate(id, updateObject, opts)
    // 🟡
    .then((returnedData) => {
      if (!returnedData) {
        return res.status(notFound).send({ message: 'Пользователь с указанным _id не найде' });
      }
      // console.log(' XXXXXX returnedData is ', returnedData);
      // console.log(' WWWWWW returnedData.avatar is ', returnedData.avatar);
      return res.status(ok).send(returnedData.avatar);
    })
    .catch((err) => {
      checkErrName(err, res, 'Переданы некорректные данные при обновлении аватара');
      return handleDefaultError(res);
    });
}

// function updateAvatar(req, res) {
//   return User.findByIdAndUpdate(req.user._id, req.body, opts)
//     .then((avatarData) =>
// checkUserInBase(res, avatarData, 'Пользователь с указанным _id не найден'))
//     .catch((err) => {
//       checkErrName(err, res, 'Переданы некорректные данные при обновлении аватара');
//       return handleDefaultError(res);
//     });
// }

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
};
