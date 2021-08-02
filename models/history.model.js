const mongoose = require('mongoose');

const HistorySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { timestamp: true },
);

const History = mongoose.model('History', HistorySchema);

module.exports = History;
