const User = require('../models/user.model');
const Score = require('../models/score.model');
const { sendResponse } = require('../lib');

const getScore = async (req, res) => {
  const { type } = req.query;

  if (type === 'leaderboard') {
    const leaderboard = await Score.aggregate([
      {
        $lookup: {
          from: User.collection.name,
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          user: { firstName: '$user.firstName', lastName: '$user.lastName' },
          score: 1,
          updatedAt: 1,
        },
      },
      {
        $group: {
          _id: '$user',
          points: { $sum: '$score' },
          timestamp: { $max: '$updatedAt' },
        },
      },
      {
        $sort: {
          points: -1,
          timestamp: 1,
        },
      },
    ]);

    return sendResponse({
      res,
      success: true,
      payload: { leaderboard },
    });
  }

  const userScore = await Score.find({ user: req.userId })
    .populate('quiz', 'name')
    .exec();

  return sendResponse({
    res,
    success: true,
    payload: { scores: userScore },
  });
};

const postScore = async (req, res) => {
  const { quiz, score } = req.body;
  const { userId } = req;

  const history = await Score.findOne({ quiz, user: userId });
  if (!history)
    await Score.create({
      user: userId,
      quiz,
      score,
    });
  else if (history.score < score) {
    history.score = score;
    await history.save();
  }

  return sendResponse({
    res,
    success: true,
    statusCode: 204,
  });
};

module.exports = {
  getScore,
  postScore,
};
