const Joi = require('joi');

const quiz = Joi.object().keys({});

const postQuiz = {
  body: Joi.object().keys({
    quiz: Joi.array().items(quiz),
  }),
};

module.exports = {
  postQuiz,
};
