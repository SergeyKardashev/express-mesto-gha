const { badRequest, notFound, ok } = require('./errorCodes');

function checkErrName(err, res, message) {
  if (err.name === 'ValidationError') {
    return res.status(badRequest).send({ message });
  }
  return res;
}

function checkIfValidationError(err, res, message) {
  if (err.name === 'ValidationError') {
    return res.status(badRequest).send({ message });
  }
  return res;
}

function checkIfCastErr(err, res, message) {
  console.log('зашел в функцию проверки на CastError');
  if (err.name === 'CastError') {
    console.log('И действительно CastError');
    return res.status(badRequest).send({ message });
  }
  console.log('А это оказывается не CastError');
  return res;
}

function checkIfDataFromDB(res, dataFromDB, message) {
  console.log('AAAAA start checkIfDataFromDB from external file');
  if (!dataFromDB) {
    return res.status(notFound).send({ message });
  }
  return res.status(ok).send(dataFromDB);
}

module.exports = {
  checkErrName,
  checkIfValidationError,
  checkIfCastErr,
  checkIfDataFromDB,
};
