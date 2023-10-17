// новая версия - шлет ответ только если юзера нет
// не работает. ОТказываюсь от нее вообще.
const { notFound } = require('./errorCodes');

module.exports = function checkUserInBase(res, user, message) {
  console.log(' XXXXXX checkUserInBase started');
  if (!user) {
    console.log(' YYYYYYY checkUserInBase found empty USER');
    return res.status(notFound).send({ message });
  }
  return user;
};

// const { notFound, ok } = require('./errorCodes');

// module.exports = function checkUserInBase(res, user, message) {
//   console.log(' XXXXXX checkUserInBase started');
//   if (!user) {
//     console.log(' YYYYYYY checkUserInBase found empty USER');
//     return res.status(notFound).send({ message });
//   }
//   console.log(' YYYYYYY checkUserInBase returned OK');
//   return res.status(ok).send(user);
// };
