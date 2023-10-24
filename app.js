const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const helmet = require('helmet');
const appRouter = require('./routes/index');

process.on('uncaughtException', (err, origin) => {
  // eslint-disable-next-line no-console
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Сработал глобальный обработчик ошибок.`);
});

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  // eslint-disable-next-line no-console
  .then(console.log('MongoDB is connected'));

const app = express();

app.use(helmet());
app.use(express.json());

// =========== временная middleware ===============
app.use((req, res, next) => {
  req.user = {
    // оставляю невалидный для тестов.
    // _id: '00000b0b000000000000b00b',
    _id: '6534054c4a138a25ed61fe45',
  };
  next();
});

// =========== подключаю статику ===============
app.use(express.static('public'));

app.use(appRouter);

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);

  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
