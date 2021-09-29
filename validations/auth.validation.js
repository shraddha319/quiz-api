const Joi = require('joi');

// TODO - test input schema

const login = {
  headers: Joi.object()
    .keys({
      Authorization: Joi.string(),
    })
    .unknown(true),
  body: Joi.object().keys({
    email: Joi.string(),
    password: Joi.string(),
  }),
};

const token = {
  headers: Joi.object()
    .keys({
      Authorization: Joi.string().required(),
    })
    .unknown(true),
};

module.exports = { login, token };
