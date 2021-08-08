/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const History = require('../models/history.model');
const Quiz = require('../models/quiz.model');
const { User } = require('../models/user.model');
const { ErrorTypes } = require('../lib');
const { DB_CONNECTION_STRING } = require('../config');

const { UNAUTHORIZED, INVALID_PARAMETERS } = ErrorTypes;
const server = app.listen(3001, () => {
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
let testQuiz = [
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
    await mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await History.deleteMany({});
    await User.create(testUsers);
    testQuiz = await Quiz.create(testQuiz);

    for (let it = 0; it < testUsers.length; it += 1) {
      const {
        body: { data },
      } = await request(app)
        .post('/auth/login')
        .send({ email: testUsers[it].email, password: testUsers[it].password });
      testUsers[it].authToken = data.authToken;
      testUsers[it].userId = data.user._id;
    }
  } catch (err) {
    console.log(err);
  }
});

beforeEach(async () => {
  await History.deleteMany({});
});

afterAll(async () => {
  server.close();
  await mongoose.connection.db.dropCollection('histories');
  await mongoose.connection.db.dropCollection('users');
  await mongoose.connection.db.dropCollection('quizzes');
});

describe('Testing /history endpoint', () => {
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
    const quizId = testQuiz[0]._id;
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

  test('should update score field in existing History document on POST /history with valid quizId and score param', async () => {
    const quizId = testQuiz[0]._id;
    const score = 10;
    const newScore = 20;
    const { userId, authToken } = testUsers[0];

    await request(app).post('/history').set('Authorization', authToken).send({
      quizId,
      score,
      userId,
    });
    await request(app).post('/history').set('Authorization', authToken).send({
      quizId,
      score: newScore,
      userId,
    });
    const history = await History.find({ quiz: quizId, user: userId });

    expect(history.length).toBe(1);
    expect(history[0].user.toString()).toBe(userId.toString());
    expect(history[0].quiz.toString()).toBe(quizId.toString());
    expect(history[0].score).toBe(newScore);
    expect(history[0].updatedAt).toBeTruthy();
  });

  test('should return leaderboard containing aggregated points in desc order by updatedAt field on GET /history with type="leaderboard"', async () => {
    const quizId1 = testQuiz[0]._id;
    const quizId2 = testQuiz[1]._id;
    const testHistory = {
      [testUsers[0].authToken]: [
        {
          quizId: quizId1,
          score: 11,
        },
        {
          quizId: quizId2,
          score: 20,
        },
      ],
      [testUsers[1].authToken]: [
        {
          quizId: quizId1,
          score: 25,
        },
      ],
    };
    for (const token of Object.keys(testHistory)) {
      for (const q of testHistory[token]) {
        await request(app)
          .post('/history')
          .set('Authorization', token)
          .send({ quizId: q.quizId, score: q.score });
      }
    }
    const expected = [
      {
        _id: testUsers[0].userId,
        points: 31,
        timestamp: expect.any(String),
      },
      {
        _id: testUsers[1].userId,
        points: 25,
        timestamp: expect.any(String),
      },
    ];

    const {
      body: {
        data: { leaderboard },
      },
      statusCode,
    } = await request(app)
      .get('/history')
      .set('Authorization', testUsers[0].authToken)
      .query({ type: 'leaderboard' });

    expect(statusCode).toBe(200);
    expect(leaderboard).toEqual(expect.arrayContaining(expected));
  });

  test('should return player history on GET /history with no type data', async () => {
    const quizId = testQuiz[0]._id;
    const score = 10;
    const { userId, authToken } = testUsers[0];

    await request(app).post('/history').set('Authorization', authToken).send({
      quizId,
      score,
      userId,
    });
    const {
      body: {
        data: { history },
      },
      statusCode,
    } = await request(app).get('/history').set('Authorization', authToken);

    expect(statusCode).toBe(200);
    expect(history.length).toBe(1);
    expect(history[0].user.toString()).toBe(userId.toString());
    expect(history[0].quiz.toString()).toBe(quizId.toString());
    expect(history[0].score).toBe(score);
    expect(history[0].updatedAt).toBeTruthy();
  });
});
