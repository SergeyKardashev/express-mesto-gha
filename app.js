const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const appRouter = require('./routes/index');

process.on('uncaughtException', (err, origin) => {
  // eslint-disable-next-line no-console
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Сработал глобальный обработчик ошибок.`);
});

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
  // eslint-disable-next-line no-console
  .then(console.log('MongoDB is connected'));

const app = express();

app.use(express.json());

// =========== временная middleware ===============
app.use((req, res, next) => {
  req.user = {
    // оставляю невалидный для тестов.
    // _id: '00000b0b000000000000b00b',
    _id: '652ba457451ba72e27d7043e',
  };
  next();
});

app.use(appRouter);

// =========== подключаю статику ===============
app.use(express.static('public'));

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);

  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
