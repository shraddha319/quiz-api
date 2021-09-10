const Joi = require('joi');
const { ApplicationError, ErrorTypes, pick } = require('../lib');
const User = require('../models/user.model');

const { VALIDATION_ERROR } = ErrorTypes;

// TODO : test

const validate = (schema, dbSchema) => async (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const data = pick(req, Object.keys(validSchema));
  const { error } = Joi.compile(validSchema)
    .prefs({ abortEarly: false })
    .validate(data);

  const errors = [];

  if (error) {
    const schemaErrors = error.details.reduce(
      (arr, err) => [
        ...arr,
        {
          message: err.message,
          type: err.type,
          key: err.context.key,
        },
      ],
      [],
    );
    errors.push(...schemaErrors);
  }

  if (dbSchema === 'User') {
    const verifyEmail = await User.isEmailTaken(
      data.body?.email,
      data.params?.userId,
    );
    if (verifyEmail) {
      errors.push({
        message: 'email taken',
        type: 'any.unique',
        key: 'email',
      });
    }
  }

  if (errors.length > 0)
    return next(new ApplicationError(VALIDATION_ERROR, errors));
  return next();
};

module.exports = validate;
