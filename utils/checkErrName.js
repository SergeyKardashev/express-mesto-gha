const { badRequest } = require('./errorCodes');

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

module.exports = {
  checkErrName,
  checkIfValidationError,
  checkIfCastErr,
};
