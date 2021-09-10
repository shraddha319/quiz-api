const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getScore = {
  query: Joi.object().keys({
    type: Joi.string().valid('leaderboard', 'user').required(),
  }),
};

const postScore = {
  body: Joi.object().keys({
    quiz: Joi.string().custom(objectId).required(),
    score: Joi.number().required(),
  }),
};

module.exports = {
  getScore,
  postScore,
};
