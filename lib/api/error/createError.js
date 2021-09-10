const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ApplicationError = require('./applicationError');
const ErrorTypes = require('./types');

const createError = (err, overrides = {}) => {
  let options;

  if (err instanceof mongoose.Error.CastError) {
    options = ErrorTypes.INVALID_ID;
  } else if (err instanceof jwt.JsonWebTokenError) {
    options = ErrorTypes.UNAUTHORIZED;
  } else options = ErrorTypes.SERVER_ERROR;
  if (err.message) options.message = err.message;

  const error = new ApplicationError(options, overrides);
  return error;
};

module.exports = createError;
