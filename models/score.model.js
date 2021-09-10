const { Schema, model } = require('mongoose');

const scoreSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    score: Number,
  },
  { timestamps: true },
);

scoreSchema.index({ user: 1, quiz: -1 });

module.exports = model('Score', scoreSchema);
