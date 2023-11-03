const appRouter = require('express').Router();
// const path = require('path'); // из вебинара для статики
const usersRouter = require('./usersRouter');
const cardsRouter = require('./cardsRouter');
const wrongRequestsRouter = require('./wrong-requests-router');
// const { STATUS_NOT_FOUND } = require('../constants/http-status');
// const NotFoundError = require('../errors/not-found-error');

// const { notFound } = require('../constants/errorCodes'); // из вебинара для статики

// const __dirname = path.resolve(); // из вебинара для статики - NOT USE IT CAUSE IT RUINS APP
// const PUBLIC_FOLDER = path.join(__dirname, 'public'); // из вебинара для статики
// const INDEX_FILE = path.join(PUBLIC_FOLDER, 'index.html'); // из вебинара для статики

appRouter.get('/signout', (req, res) => { res.clearCookie('jwt').send({ message: 'Выход' }); }); // по совету ревьювера
appRouter.use('/users', usersRouter);
appRouter.use('/cards', cardsRouter);
appRouter.use('*', wrongRequestsRouter);

// appRouter.use('*', (req, res) => res.sendFile(INDEX_FILE)); // из вебинара для статики

module.exports = appRouter;

//
//
//
// ========= запас для статики. Не сработал.
//
//
//
// const appRouter = require('express').Router();
// const path = require('path'); // из вебинара для статики
// const usersRouter = require('./usersRouter');
// const cardsRouter = require('./cardsRouter');
// const wrongRequestsRouter = require('./wrong-requests-router');

// // const __dirname = path.resolve(); // из вебинара для статики - NOT USE IT CAUSE IT RUINS APP
// const PUBLIC_FOLDER = path.join(__dirname, 'public'); // из вебинара для статики
// const INDEX_FILE = path.join(PUBLIC_FOLDER, 'index.html'); // из вебинара для статики

// appRouter.use('/users', usersRouter);
// appRouter.use('/cards', cardsRouter);
// appRouter.use('*', wrongRequestsRouter);

// appRouter.get('*', (req, res) => res.sendFile(INDEX_FILE)); // из вебинара для статики

// module.exports = appRouter;
