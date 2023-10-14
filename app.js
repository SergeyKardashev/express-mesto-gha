const express = require('express');
const mongoose = require('mongoose');
const {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  deleteUser,
} = require('./controllers/users');
const { createCard, getCards, deleteCard } = require('./controllers/cards');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(console.log('MongoDB is connected'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65293b7b592661671049f81d',
  };
  next();
});

// =========== подключаю статику ===============
app.use(express.static('public'));

// CRUD

// Create - создаю карточку
app.post('/cards', createCard);

// Create - создаю юзера
app.post('/users', createUser);

// Update - обновляю аватарку
app.patch('/users/me/avatar', updateAvatar);

// Update - обновляю юзера
app.patch('/users/me', updateUser);

// Read 1 of 2 - получаю 1 юзера
app.get('/users/:userId', getUserById);

// Read 2 of 2 - получаю ВСЕХ юзеров
app.get('/users', getUsers);

app.get('/cards', getCards);

// Delete - удаляю юзера
app.delete('/users/:userId', deleteUser);

app.delete('/cards/:cardId', deleteCard);

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);
  console.log(`App listening on port ${PORT}`);
});
