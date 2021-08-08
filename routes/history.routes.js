const express = require('express');
const {
  catchAsync,
  sendResponse,
  ErrorTypes,
  ApplicationError,
} = require('../lib/index');
const History = require('../models/history.model');
const tokenVerifier = require('../middleware/tokenVerifier');

const router = express.Router();
const { INVALID_PARAMETERS } = ErrorTypes;

router.use(tokenVerifier);
router
  .route('/')
  .get(
    catchAsync(async (req, res, next) => {
      const { type } = req.query;

      if (type === 'leaderboard') {
        const leaderboard = await History.aggregate([
          {
            $group: {
              _id: '$user',
              points: { $sum: '$score' },
              timestamp: { $max: '$updatedAt' },
            },
          },
        ]);

        return sendResponse({
          res,
          success: true,
          payload: { leaderboard },
        });
      }

      const userHistory = await History.find({ user: req.userId });

      return sendResponse({
        res,
        success: true,
        payload: { history: userHistory },
      });
    }),
  )
  .post(
    catchAsync(async (req, res, next) => {
      const { quizId, score } = req.body;
      const { userId } = req;
      if (!quizId || !score)
        return next(new ApplicationError(INVALID_PARAMETERS));

      const history = await History.findOne({ quiz: quizId, user: userId });
      if (!history)
        await History.create({
          user: userId,
          quiz: quizId,
          score,
        });
      else {
        history.score = score;
        await history.save();
      }

      return sendResponse({
        res,
        success: true,
        statusCode: 204,
      });
    }),
  );

module.exports = router;
