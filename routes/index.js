const appRouter = require('express').Router();
const usersRouter = require('./usersRouter');
const cardsRouter = require('./cardsRouter');
const { notFound } = require('../constants/errorCodes');

// =========== временная мидлвара ===============
// хотел унести из точки входа, но автотесты ругаются.
// appRouter.use((req, res, next) => {
//   req.user = {
//     // _id: '00000b0b000000000000b00b',
//     _id: '652ba457451ba72e27d7043e',
//   };
//   next();
// });
function wrongUrl(req, res) {
  return res.status(notFound).send({ message: 'Wrong URL' });
}

appRouter.use('/users', usersRouter);
appRouter.use('/cards', cardsRouter);
appRouter.use('*', wrongUrl);

module.exports = appRouter;
