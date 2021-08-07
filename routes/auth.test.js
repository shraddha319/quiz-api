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
  test.only('should return INVALID_PARAMETERS error if email or username or password are missing', async () => {
    const {
      body: { error, success },
      statusCode,
    } = await request(app).post('/auth/login');

    expect(success).toBe(false);
    expect(statusCode).toBe(INVALID_PARAMETERS.statusCode);
    expect(error.code).toBe(INVALID_PARAMETERS.code);
  });
});
