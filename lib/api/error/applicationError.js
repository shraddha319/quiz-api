class ApplicationError extends Error {
  constructor(options, errors, overrides = {}) {
    super();
    this.message = options.message;
    this.name = 'ApplicationError';
    this.statusCode = options.statusCode;
    this.code = options.code;
    if (errors) this.errors = errors;
    Object.assign(this, overrides);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApplicationError;
