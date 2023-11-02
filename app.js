const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const { Joi } = require('celebrate');
// const { celebrate } = require('celebrate');
const { validateLogin, validateCreateUser, validateToken } = require('./validators/celebrate-validators');
const appRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');

// IN CASE THERE IS AN ERROR THAT HASN'T BEEN HANDLED
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
app.use(cookieParser());

// =========== ADD STATIC ===============
// app.use(express.static('public'));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser); // register

app.use(validateToken);
app.use(auth);
app.use(appRouter);
app.use(errors()); // celebrate error handler
app.use(errorHandler); // global error handler and sorter for CAUGHT errors

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);

  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
