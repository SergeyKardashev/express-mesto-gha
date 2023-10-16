module.exports = function checkUserInBase(res, user, message) {
  if (!user) {
    return res.status(404).send({ message });
  }
  return res.status(200).send(user);
};
