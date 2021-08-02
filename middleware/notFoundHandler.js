const { ApplicationError, ErrorTypes } = require('../lib/index');

const { RESOURCE_NOT_FOUND } = ErrorTypes;

const notFoundHandler = (req, res, next) => {
  const err = new ApplicationError(RESOURCE_NOT_FOUND, {
    message: `can't find ${req.originalUrl} on server`,
  });
  next(err);
};

module.exports = notFoundHandler;
