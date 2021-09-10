const Quiz = require('../models/quiz.model');
const { sendResponse } = require('../lib');

const getQuiz = async (req, res) => {
  const quiz = await Quiz.find({});
  return sendResponse({
    res,
    success: true,
    payload: { quiz },
  });
};

const postQuiz = async (req, res) => {
  const savedQuiz = await Quiz.create(req.body);

  return sendResponse({
    res,
    success: true,
    payload: { quiz: savedQuiz },
  });
};

module.exports = {
  getQuiz,
  postQuiz,
};
