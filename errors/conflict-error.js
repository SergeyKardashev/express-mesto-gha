const { STATUS_CONFLICT } = require('../constants/http-status');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
