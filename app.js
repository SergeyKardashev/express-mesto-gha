const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const {
  celebrate,
  Joi,
  errors,
  Segments,
} = require('celebrate');
const appRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const ConflictError = require('./errors/conflict-error');

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

// =========== временная middleware ===============
// app.use((req, res, next) => {
//   req.user = {
//     // оставляю невалидный для тестов.
//     // _id: '00000b0b000000000000b00b',
//     _id: '6534054c4a138a25ed61fe45',
//   };
//   next();
// });

// [Segments.HEADERS]: Joi.object().keys(),

// [Segments.BODY]: Joi.object().keys({
//   name: Joi.string().alphanum().min(2).max(30).required(),
//   email: Joi.string().required().email(),
//   password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required().min(8),
//   repeat_password: Joi.ref('password'),
//   age: Joi.number().integer().required().min(18),
//   about: Joi.string().min(2).max(30),
// }),

// [Segments.HEADERS]: Joi.object({
//   token: Joi.string().required().regex(/abc\d{3}/),
// }).unknown(),

// =========== подключаю статику ===============
app.use(express.static('public'));

// Логин
app.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// регистрация register
app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      repeat_password: Joi.ref('password'),
    }),
  }),
  createUser,
);

// проверка себебрейтом на наличие токена в виде строки
// только для роутов после логина и после создания юзера.
// но в авторизационный роут дорога только через этот валидационный
app.use(celebrate({
  [Segments.COOKIES]: Joi.object({
    jwt: Joi.string().required(),
  }).options({ allowUnknown: true }),
}));

app.use(auth);
app.use(appRouter);

// Маршрут для генерации ошибки
app.get('/error', (req, res, next) => {
  const myError = new ConflictError('====== Пример ошибки с конфликтом ========');
  next(myError); // Вызов ошибки и передача ее в middleware
});

app.use(errors()); // from celebrate

app.use(errorHandler);
// Централизованный обработчик ошибок подключать после appRoueter и auth?
// Так ошибки, выбрасываемые в некст попадут в централизованный обработчик

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);

  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
