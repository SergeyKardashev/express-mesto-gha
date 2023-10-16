const appRouter = require('express').Router();
const usersRouter = require('./usersRouter');
const cardsRouter = require('./cardsRouter');

// =========== временная мидлвара ===============
appRouter.use((req, res, next) => {
  req.user = {
    // _id: '00000b0b000000000000b00b',
    _id: '652ba457451ba72e27d7043e',
  };
  next();
});

appRouter.use(usersRouter);
appRouter.use(cardsRouter);

module.exports = appRouter;
