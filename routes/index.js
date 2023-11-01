const appRouter = require('express').Router();
// const path = require('path'); // из вебинара для статики
const usersRouter = require('./usersRouter');
const cardsRouter = require('./cardsRouter');
// const { notFound } = require('../constants/errorCodes'); // из вебинара для статики

// const __dirname = path.resolve(); // из вебинара для статики
// const PUBLIC_FOLDER = path.join(__dirname, 'public'); // из вебинара для статики
// const INDEX_FILE = path.join(PUBLIC_FOLDER, 'index.html'); // из вебинара для статики

appRouter.use('/users', usersRouter);
appRouter.use('/cards', cardsRouter);

// appRouter.use('*', (req, res) => res.sendFile(INDEX_FILE));  // из вебинара для статики

module.exports = appRouter;
