const express = require('express');
const { getScore, postScore } = require('../controllers/scores.controller');
const { validate } = require('../middlewares');
const validation = require('../validations/scores.validation');
const { catchAsync } = require('../lib');

const router = express.Router();

/**
 * GET /users/:userId/scores (?type=leaderboard/user)
 * POST /users/:userId/scores
 */

router
  .route('/')
  .get(validate(validation.getScore), catchAsync(getScore))
  .post(validate(validation.postScore), catchAsync(postScore));

module.exports = router;
