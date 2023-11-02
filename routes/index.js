const appRouter = require('express').Router();
// const path = require('path'); // из вебинара для статики
const usersRouter = require('./usersRouter');
const cardsRouter = require('./cardsRouter');
const { STATUS_BAD_REQUEST } = require('../constants/http-status');

// const { notFound } = require('../constants/errorCodes'); // из вебинара для статики

// const __dirname = path.resolve(); // из вебинара для статики - NOT USE IT CAUSE IT RUINS APP
// const PUBLIC_FOLDER = path.join(__dirname, 'public'); // из вебинара для статики
// const INDEX_FILE = path.join(PUBLIC_FOLDER, 'index.html'); // из вебинара для статики

// function wrongRoute(req, res) {
//   return res.status(STATUS_BAD_REQUEST).send({ message: 'Запрошенной страницы не существует' });
// }

appRouter.use('/users', usersRouter);
appRouter.use('/cards', cardsRouter);

appRouter.get('*', (req, res) => res.status(STATUS_BAD_REQUEST).send({ message: 'Запрошенной страницы не существует' }));

// appRouter.use('*', (req, res) => res.sendFile(INDEX_FILE)); // из вебинара для статики

module.exports = appRouter;
