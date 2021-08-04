/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const History = require('../models/history.model');
const Quiz = require('../models/quiz.model');
const { User } = require('../models/user.model');
const { ErrorTypes } = require('../lib/index');

const { UNAUTHORIZED, INVALID_PARAMETERS } = ErrorTypes;
app.listen(3001, () => {
  console.log('listening on port 3001');
});

const testUser = {
  username: 'test',
  email: 'test@email.com',
  password: 'test12345',
};
const testQuiz = {
  name: 'test quiz',
  description: 'sample quiz',
  questions: [
    {
      question: 'test quiz question',
      options: [
        {
          option: 'option',
          isRight: true,
        },
      ],
      points: 1,
    },
  ],
};
let testAuthToken;

beforeAll(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://shraddha:Shekar@560037BEN@cluster0.xnwmi.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    await History.deleteMany({});
    console.log('DB connected');

    await User.create(testUser);
    await Quiz.create(testQuiz);
    const {
      body: {
        data: { authToken },
      },
    } = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    testAuthToken = authToken;
  } catch (err) {
    console.log(err);
  }
});

beforeEach(async () => {
  await History.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropCollection('histories');
  await mongoose.connection.db.dropCollection('users');
  await mongoose.connection.db.dropCollection('quizzes');
});

describe('Testing /history endpoint for quiz api', () => {
  test('should return UNAUTHORIZED error on GET /history without authorization token', async () => {
    const {
      body: { error },
      statusCode,
    } = await request(app).get('/history');
    expect(error.name).toBe('ApplicationError');
    expect(statusCode).toBe(UNAUTHORIZED.statusCode);
    expect(error.code).toBe(UNAUTHORIZED.code);
  });

  test('should return UNAUTHORIZED error on POST /history without authorization token', async () => {
    const {
      body: { error },
      statusCode,
    } = await request(app).post('/history');
    expect(error.name).toBe('ApplicationError');
    expect(statusCode).toBe(UNAUTHORIZED.statusCode);
    expect(error.code).toBe(UNAUTHORIZED.code);
  });

  test('should return INVALID_PARAMETERS error on POST /history without quizId or score params', async () => {
    const {
      body: { error },
      statusCode,
    } = await request(app).post('/history').set('Authorization', testAuthToken);
    expect(error.name).toBe('ApplicationError');
    expect(statusCode).toBe(INVALID_PARAMETERS.statusCode);
    expect(error.code).toBe(INVALID_PARAMETERS.code);
  });

  test('should create a new History document on POST /history with valid quizId and score param', async () => {
    expect(1).toBe(0);
  });

  test('should update existing score field in History document on POST /history with valid quizId and score param', async () => {
    expect(1).toBe(0);
  });

  test('should return leaderboard containing aggregated points on POST /history with type="leaderboard"', async () => {
    expect(1).toBe(0);
  });

  test('should return player history on POST /history with no type data', () => {
    expect(1).toBe(0);
  });
});
