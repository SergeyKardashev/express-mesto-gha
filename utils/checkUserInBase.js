// // убераю ОК из импорта, так как ответ при наличии пользователя будет слать другая функция.
// const { notFound } = require('./errorCodes');

// // проверяет наличие юзера не в БД, а в ответе. Кажется.
// module.exports = function checkUserInBase(res, user, message) {
//   console.log('user from callback checkUserInBase', user);
//   console.log('user ava is ', user.avatar);
//   if (!user) {
//     return res.status(notFound).send({ message });
//   }
//   // удаляю из вывода отправку. Эта функция отвечает только если НЕТ юзера;
//   return res;
// };

const { notFound, ok } = require('./errorCodes');

module.exports = function checkUserInBase(res, user, message) {
  console.log('user from callback checkUserInBase', user);
  console.log('user ava is ', user.avatar);
  if (!user) {
    return res.status(notFound).send({ message });
  }
  return res.status(ok).send(user);
};
