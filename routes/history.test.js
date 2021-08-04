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

const testUsers = [
  {
    username: 'test1',
    email: 'test1@email.com',
    password: 'test012345',
    authToken: null,
    userId: null,
  },
  {
    username: 'test2',
    email: 'test2@email.com',
    password: 'test56789',
    authToken: null,
    userId: null,
  },
];

const testQuiz = [
  {
    name: 'test quiz 1',
    description: 'test quiz 1',
    questions: [
      {
        question: 'test quiz question 1',
        options: [
          {
            option: 'option',
            isRight: true,
          },
        ],
        points: 1,
      },
    ],
  },
  {
    name: 'test quiz 2',
    description: 'test quiz 2',
    questions: [
      {
        question: 'test quiz question 2',
        options: [
          {
            option: 'option',
            isRight: true,
          },
        ],
        points: 1,
      },
    ],
  },
];

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

    await User.create(testUsers);
    await Quiz.create(testQuiz);

    //   testUsers.forEach(async (user, index, arr) => {
    //     const {
    //       body: {
    //         data: { authToken },
    //       },
    //     } = await request(app)
    //       .post('/auth/login')
    //       .send({ email: user.email, password: user.password });
    //     arr[index].authToken = authToken;
    // });
    for (let it = 0; it < testUsers.length; it += 1) {
      const {
        body: { data },
      } = await request(app)
        .post('/auth/login')
        .send({ email: testUsers[it].email, password: testUsers[it].password });
      testUsers[it].authToken = data.authToken;
      testUsers[it].userId = data.userID;
    }
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
    } = await request(app)
      .post('/history')
      .set('Authorization', testUsers[0].authToken);
    expect(error.name).toBe('ApplicationError');
    expect(statusCode).toBe(INVALID_PARAMETERS.statusCode);
    expect(error.code).toBe(INVALID_PARAMETERS.code);
  });

  test('should create a new History document on POST /history with valid quizId and score param', async () => {
    const quiz = await Quiz.find({});
    const quizId = quiz[0]._id;
    const score = 10;
    const { userId, authToken } = testUsers[0];

    const { statusCode } = await request(app)
      .post('/history')
      .set('Authorization', authToken)
      .send({
        quizId,
        score,
        userId,
      });

    const history = await History.find({ quiz: quizId, user: userId });
    expect(statusCode).toBe(204);
    expect(history.length).toBe(1);
    expect(history[0].user.toString()).toBe(userId.toString());
    expect(history[0].quiz.toString()).toBe(quizId.toString());
    expect(history[0].score).toBe(score);
    expect(history[0].updatedAt).toBeTruthy();
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