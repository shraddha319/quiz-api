const mongoose = require('mongoose');

const historySchema = mongoose.Schema(
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
  { timestamps: true },
);

historySchema.index({ user: 1, quiz: -1 });

const History = mongoose.model('History', historySchema);

module.exports = History;
