// class ApplicationError extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.name = 'ApplicationError';
//     this.statusCode = statusCode;
//   }
// }

class ApplicationError extends Error {
  constructor(options, overrides = {}) {
    super();
    this.message = options.message;
    this.name = 'ApplicationError';
    this.statusCode = options.statusCode;
    this.code = options.code;
    Object.assign(this, overrides);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApplicationError;
