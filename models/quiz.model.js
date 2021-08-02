const mongoose = require('mongoose');

const QuizSchema = mongoose.Schema({
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
          value: String,
          isCorrect: Boolean,
        },
      ],
      points: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
