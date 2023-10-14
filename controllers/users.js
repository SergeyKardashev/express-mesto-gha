const { UserModel } = require('../models/user');

// CRUD

// Create (1 user only)
function createUser(req, res) {
  const userData = req.body;
  return UserModel.create(userData)
    .then((returnedUserData) => res.status(200).send(returnedUserData))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
}

// Read 1 of 2 - Get 1 user
function getUserById(req, res) {
  const { userId } = req.params;
  return UserModel.findById(userId)
    .then((userData) => {
      if (!userData) {
        return res.status(404).send({ message: 'User Not Found' });
      }
      return res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
}

// Read 2 of 2 - Get ALL user
function getUsers(req, res) {
  console.log('GET USERS STRARTED');
  console.log('UserModel is ', UserModel);
  return UserModel.find()
    .then((usersData) => res.status(200).send(usersData))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
}

// Update 1 - update user
function updateUser(req, res) {
  console.log('STARTED updateUser');

  const { userId } = req.params;
  console.log('userId from updateUser : ', userId);

  const userData = req.body;
  console.log('userData from updateUser : ', userData);

  return UserModel.findByIdAndUpdate(userId, userData)
    .then((updatedUserData) => res.status(200).send(updatedUserData))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
}

// Update 1 - update avatar
function updateAvatar(req, res) {
  console.log('req.params', req.params);
  const { userId } = req.params;
  return UserModel.findByIdAndUpdate(userId)
    .then((returnedUserData) => res.status(200).send(returnedUserData))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
}

// Delete
function deleteUser(req, res) {
  const { userId } = req.params;
  return UserModel.findByIdAndDelete(userId)
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send({ message: 'Server Error' }));
}

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  deleteUser,
};
