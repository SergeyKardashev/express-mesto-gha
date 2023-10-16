const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/usersRouter');
const cardsRouter = require('./routes/usersRouter');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
  .then(console.log('MongoDB is connected'));

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(cardsRouter);

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

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);
  console.log(`App listening on port ${PORT}`);
});
