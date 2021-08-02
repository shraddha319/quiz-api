const ErrorTypes = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    message: 'Validation failed',
  },

  INVALID_PARAMETERS: {
    code: 'INVALID_PARAMETERS',
    statusCode: 400,
    message: 'Parameters are invalid.',
  },

  INVALID_ID: {
    code: 'INVALID_ID',
    statusCode: 400,
    message: 'ID is invalid',
  },

  AUTHENTICATION_ERROR: {
    code: 'AUTHENTICATION_ERROR',
    statusCode: 401,
    message: 'User authentication failed.',
  },

  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    statusCode: 403,
    message: 'User is not authorized.',
  },

  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    statusCode: 404,
    message: 'Resource not found',
  },

  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    statusCode: 500,
    message: 'Something went wrong. Please try again later',
  },
};

module.exports = ErrorTypes;
