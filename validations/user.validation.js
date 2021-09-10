const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

// TODO - test all validation types
// separate them from the route controller tests

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .min(8)
      .regex(/[a-zA-Z]/)
      .messages({
        'string.min': 'Must have atleast 8 characters',
        'string.pattern.base': 'Must have only letters',
      }),
    firstName: Joi.string().required(),
    lastName: Joi.string(),
  }),
};

const getUserById = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const updateUserById = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    firstName: Joi.string(),
    lastName: Joi.string(),
  }),
};

const deleteUserById = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
