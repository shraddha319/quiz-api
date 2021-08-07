const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { User } = require('../models/user.model');
const { ErrorTypes } = require('../lib');
const { DB_CONNECTION_STRING } = require('../config');

const { AUTHENTICATION_ERROR, INVALID_PARAMETERS } = ErrorTypes;

const server = app.listen(3001, () => {
  console.log('listening on port 3001');
});

beforeAll(async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany({});
  } catch (err) {
    console.log(err);
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  server.close();
  await mongoose.connection.db.dropCollection('users');
});

describe('Testing POST /auth/login endpoint', () => {
  test('should return INVALID_PARAMETERS error if email or username or password are missing', async () => {
    const {
      body: { error, success },
      statusCode,
    } = await request(app).post('/auth/login').send({});

    expect(success).toBe(false);
    expect(statusCode).toBe(INVALID_PARAMETERS.statusCode);
    expect(error.code).toBe(INVALID_PARAMETERS.code);
  });

  test('should authenticate a registered user with email/username and password and return token', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const username = 'shraddha98';

    const {
      body: {
        data: { user },
      },
    } = await request(app).post('/user').send({
      user: { email, password, username },
    });

    // login with email
    const {
      body: { data: emailAuth },
      statusCode: emailAuthStatusCode,
    } = await request(app).post('/auth/login').send({ email, password });

    // login with username
    const {
      body: { data: usernameAuth },
      statusCode: usernameAuthStatusCode,
    } = await request(app).post('/auth/login').send({ username, password });
    const expected = {
      userId: user._id,
      authToken: expect.any(String),
    };

    expect(emailAuthStatusCode).toBe(200);
    expect(usernameAuthStatusCode).toBe(200);
    expect(emailAuth).toMatchObject(expected);
    expect(usernameAuth).toMatchObject(expected);
  });

  test('should return AUTHENTICATION_ERROR error on incorrect password', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const username = 'shraddha98';
    await request(app).post('/user').send({
      user: { email, password, username },
    });

    const {
      body: { error },
      statusCode,
    } = await request(app)
      .post('/auth/login')
      .send({ email, password: 'incorrect' });

    expect(statusCode).toBe(AUTHENTICATION_ERROR.statusCode);
    expect(error.code).toBe(AUTHENTICATION_ERROR.code);
    expect(error.message).toBe(AUTHENTICATION_ERROR.message);
  });
});
