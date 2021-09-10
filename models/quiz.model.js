const { Schema, model } = require('mongoose');

const quizSchema = Schema({
  name: String,
  description: String,
  questions: [
    {
      question: String,
      options: [
        {
          option: String,
          isRight: Boolean,
        },
      ],
      points: Number,
    },
  ],
});

module.exports = model('Quiz', quizSchema);
