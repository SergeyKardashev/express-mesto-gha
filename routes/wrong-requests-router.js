const wrongRequestsRouter = require('express').Router();
const { STATUS_NOT_FOUND } = require('../constants/http-status');
// const NotFoundError = require('../errors/not-found-error');

const markup = `
  <!DOCTYPE html>
  <html><head><title>Нет такой страницы</title><meta charset="UTF-8"></head>
  <body>Нет такой страницы</body></html>
`;

wrongRequestsRouter.use('*', (req, res) => res.status(STATUS_NOT_FOUND).send(markup));

// wrongRequestsRouter.use('*', (req, res, next) => {
//   next(new NotFoundError('Запрошенной страницы не существует'));
// });

module.exports = wrongRequestsRouter;
