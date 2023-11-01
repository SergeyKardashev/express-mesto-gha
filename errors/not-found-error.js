const { STATUS_NOT_FOUND } = require('../constants/http-status');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
