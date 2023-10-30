const appRouter = require('express').Router();
// const path = require('path');
const usersRouter = require('./usersRouter');
const cardsRouter = require('./cardsRouter');
// const { notFound } = require('../constants/errorCodes');

// const __dirname = path.resolve();
// const PUBLIC_FOLDER = path.join(__dirname, 'public');
// const INDEX_FILE = path.join(PUBLIC_FOLDER, 'index.html');

// =========== временная мидлвара ===============
// хотел унести из точки входа, но автотесты ругаются.
// appRouter.use((req, res, next) => {
//   req.user = {
//     // _id: '00000b0b000000000000b00b',
//     _id: '652ba457451ba72e27d7043e',
//   };
//   next();
// });

appRouter.use('/users', usersRouter);
appRouter.use('/cards', cardsRouter);

// function wrongUrl(req, res) {
//   return res.status(notFound).send({ message: 'Wrong URL' });
// }
// appRouter.use('*', wrongUrl);

// appRouter.use('*', (req, res) => res.sendFile(INDEX_FILE));

module.exports = appRouter;
