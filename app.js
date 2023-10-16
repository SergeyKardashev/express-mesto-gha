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
app.use(appRouter);

// =========== подключаю статику ===============
app.use(express.static('public'));

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);

  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
