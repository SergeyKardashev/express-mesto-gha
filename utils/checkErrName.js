module.exports = function checkErrName(err, res, message) {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message });
  }
  return res;
};
