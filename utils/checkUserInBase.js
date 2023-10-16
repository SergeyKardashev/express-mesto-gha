const { notFound, ok } = require('./errorCodes');

module.exports = function checkUserInBase(res, user, message) {
  if (!user) {
    return res.status(notFound).send({ message });
  }
  return res.status(ok).send(user);
};
