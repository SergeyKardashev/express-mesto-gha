// новая версия отправляет только если ошибка. Если ок - выходит.
const { notFound } = require('./errorCodes');

module.exports = function checkIfDataFromDB(res, dataFromDB, message) {
  console.log('Зашел в checkIfDataFromDB');
  if (!dataFromDB) {
    console.log('Зашел в условие checkIfDataFromDB, т.е. нет данных от БД, шлю респонс с 404');
    return res.status(notFound).send({ message });
  }
  console.log(' Выхожу из checkIfDataFromDB, данныеБД - ок. Возвращаю из из КБ');
  return dataFromDB;
};

// const { ok, notFound } = require('./errorCodes');

// module.exports = function checkIfDataFromDB(res, dataFromDB, message) {
//   console.log('AAAAA start checkIfDataFromDB from external file');
//   if (!dataFromDB) {
//     return res.status(notFound).send({ message });
//   }
//   return res.status(ok).send(dataFromDB);
// };
