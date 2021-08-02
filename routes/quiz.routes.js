const express = require('express');
const { catchAsync, sendResponse } = require('../lib/index');
const Quiz = require('../models/quiz.model');

const router = express.Router();

router
  .route('/')
  .get(
    catchAsync(async (req, res, next) => {
      const quiz = await Quiz.find({});
      return sendResponse({
        res,
        success: true,
        payload: { quiz },
      });
    }),
  )
  .post(
    catchAsync(async (req, res, next) => {
      const { quiz } = req.body;
      // can insert single doc/array of docs
      const savedQuiz = await Quiz.create(quiz);
      return sendResponse({
        res,
        success: true,
        payload: { quiz: savedQuiz },
      });
    }),
  );

module.exports = router;
