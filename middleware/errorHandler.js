const { ApplicationError, createError, sendResponse } = require('../lib/index');
const { NODE_ENV } = require('../config');

const errorHandler = (err, req, res, next) => {
  // if (err instanceof mongoose.Error.ValidationError) {
  //   /**
  //    * - covers required validation
  //    * - type validation - does implicit type casting. if fails, throws validationerror
  //    * - extra fields not given in schema - will not be added to db
  //    */
  //   err.statusCode = 400;
  //   err.code = 'VALIDATION_FAILED';
  // } else if (err instanceof mongoose.Error.CastError) {
  //   err.statusCode = 400;
  //   if (err.kind === 'ObjectId') err.code = 'INVALID_ID';
  // } else {
  //   err.statusCode = err.statusCode || 500;
  // }

  // if (err.statusCode === 404) err.code = 'NOT_FOUND';

  // err.status = err.status || 'error';
  // res.status(err.statusCode).json({
  //   status: err.status,
  //   code: err.code,
  //   message: err.message,
  // });
  let error;
  if (!(err instanceof ApplicationError)) error = createError(err);
  else {
    error = { ...err };
    error.message = err.message;
  }

  if (NODE_ENV === 'production') error.stack = err.stack;

  return sendResponse({
    res,
    success: false,
    payload: error,
    statusCode: error.statusCode,
  });
};

module.exports = errorHandler;
