const express = require('express');
const mongoose = require('mongoose');
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateAvatar,
} = require('./controllers/users');
const {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('./controllers/cards');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(console.log('MongoDB is connected'));

const app = express();

app.use(express.json());

// =========== временная мидлвара ===============
app.use((req, res, next) => {
  req.user = {
    // _id: '00000b0b000000000000b00b',
    _id: '652ba457451ba72e27d7043e',
  };
  next();
});

// =========== подключаю статику ===============
app.use(express.static('public'));

app.post('/cards', createCard);
app.post('/users', createUser);
app.patch('/users/me/avatar', updateAvatar);
app.patch('/users/me', updateUser);
app.get('/users/:userId', getUserById);
app.get('/users', getAllUsers);
app.get('/cards', getCards);
app.put('/cards/:cardId/likes', likeCard);
app.delete('/cards/:cardId/likes', dislikeCard);
app.delete('/cards/:cardId', deleteCard);

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);
  console.log(`App listening on port ${PORT}`);
});
