const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          option: String,
          isRight: Boolean,
        },
      ],
      points: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
