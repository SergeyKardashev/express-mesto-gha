const appRouter = require('express').Router();
// const path = require('path'); // из вебинара для статики
const usersRouter = require('./usersRouter');
const cardsRouter = require('./cardsRouter');
// const { notFound } = require('../constants/errorCodes'); // из вебинара для статики

// const __dirname = path.resolve(); // из вебинара для статики
// const PUBLIC_FOLDER = path.join(__dirname, 'public'); // из вебинара для статики
// const INDEX_FILE = path.join(PUBLIC_FOLDER, 'index.html'); // из вебинара для статики

/*
// =========== временная мидлвара ===============
// хотел унести из точки входа, но автотесты ругаются.
// appRouter.use((req, res, next) => {
//   req.user = {
//     // _id: '00000b0b000000000000b00b',
//     _id: '652ba457451ba72e27d7043e',
//   };
//   next();
// });
*/

appRouter.use('/users', usersRouter);
appRouter.use('/cards', cardsRouter);

//
// кусок для статики
//
// моя самоделка
// function wrongUrl(req, res) res.status(notFound).send({ message: 'Wrong URL' });
// appRouter.use('*', wrongUrl);
//
// с вебинара
// appRouter.use('*', (req, res) => res.sendFile(INDEX_FILE));

module.exports = appRouter;
