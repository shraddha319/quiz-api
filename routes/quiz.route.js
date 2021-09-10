const express = require('express');
const { catchAsync } = require('../lib');
const { validate } = require('../middlewares');
const { getQuiz, postQuiz } = require('../controllers/quiz.controller');
const validation = require('../validations/quiz.validation');

const router = express.Router();

router
  .route('/')
  .get(catchAsync(getQuiz))
  .post(validate(validation.postQuiz), catchAsync(postQuiz));

module.exports = router;
