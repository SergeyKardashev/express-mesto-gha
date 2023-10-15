module.exports = class DefaultServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DefaultServerError';
    this.statusCode = 500;
  }
};
