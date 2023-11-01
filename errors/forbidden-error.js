const { STATUS_FORBIDDEN } = require('../constants/http-status');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
