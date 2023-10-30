const { STATUS_BAD_REQUEST } = require('../constants/http-status');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
