const { notValid } = require('./errorCodes');

module.exports = function checkErrName(err, res, message) {
  if (err.name === 'ValidationError') {
    return res.status(notValid).send({ message });
  }
  return res;
};
