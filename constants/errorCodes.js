const ok = 200;
const created = 201;
const badRequest = 400;
const Unauthorized = 401;
const notFound = 404;
const InternalServerError = 500;
const MONGO_DUPLICATE_ERROR = 11000;

module.exports = {
  notFound, badRequest, ok, created, InternalServerError, Unauthorized, MONGO_DUPLICATE_ERROR,
};
