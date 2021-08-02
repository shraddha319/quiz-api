const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ApplicationError = require('./applicationError');
const ErrorTypes = require('./types');

const getMongooseValidationErrors = (errors) =>
  Object.keys(errors).reduce((res, key) => {
    const { message, type, path } = errors[key].properties;
    res.push({ message, type, path });
    return res;
  }, []);

const createError = (err, overrides = {}) => {
  let options;
  let validationErrors;

  if (err instanceof mongoose.Error.ValidationError) {
    options = ErrorTypes.VALIDATION_ERROR;
    validationErrors = getMongooseValidationErrors(err.errors);
  } else if (err instanceof mongoose.Error.CastError) {
    options = ErrorTypes.INVALID_ID;
  } else if (err instanceof jwt.JsonWebTokenError) {
    options = ErrorTypes.UNAUTHORIZED;
  } else options = ErrorTypes.SERVER_ERROR;
  if (err.message) options.message = err.message;
  const error = new ApplicationError(options, {
    ...overrides,
    validationErrors,
  });
  return error;
};

module.exports = createError;
