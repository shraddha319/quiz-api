/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { User } = require('../models/user.model');
const { ErrorTypes } = require('../lib');
const { DB_CONNECTION_STRING } = require('../config');

const { VALIDATION_ERROR } = ErrorTypes;

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

describe('Testing POST /user endpoint', () => {
  test('should not register user if required fields are absent.', async () => {
    /**
     * email, password, username are required fields
     * should give VALIDATION_ERROR with status code 400, type required
     */
    const expectedValidError = {
      email: {
        type: 'required',
        message: expect.any(String),
      },
      username: {
        type: 'required',
        message: expect.any(String),
      },
      password: {
        type: 'required',
        message: expect.any(String),
      },
    };
    const {
      body: { error, success },
      statusCode,
    } = await request(app).post('/user').send({ user: {} });
    const user = await User.find({});

    expect(success).toBe(false);
    expect(error.name).toBe('ApplicationError');
    expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
    expect(error.code).toBe(VALIDATION_ERROR.code);
    expect(error.validationErrors).toEqual(expectedValidError);
    expect(user.length).toBe(0);
  });

  test('should not register user if unique constraint on email and username is not met.', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const username = 'shraddha98';
    const expectedValidError = {
      email: { type: 'unique', message: expect.any(String) },
      username: { type: 'unique', message: expect.any(String) },
    };

    const { status } = await request(app)
      .post('/user')
      .send({ user: { email, password, username } });

    expect(status).toBe(201);

    const {
      body: { error, success },
      statusCode,
    } = await request(app)
      .post('/user')
      .send({ user: { email, password, username } });
    const user = await User.find({ email });

    expect(success).toBe(false);
    expect(error.name).toBe('ApplicationError');
    expect(error.code).toBe(VALIDATION_ERROR.code);
    expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
    expect(error.validationErrors).toEqual(expectedValidError);
    expect(user.length).toBe(1);
  });

  test('should not register user if password does not meet criteria', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'abc';
    const username = 'shraddha98';
    const expectedValidError = {
      password: { type: 'minlength', message: expect.any(String) },
    };

    const {
      body: { error, success },
      statusCode,
    } = await request(app)
      .post('/user')
      .send({ user: { email, password, username } });

    expect(success).toBe(false);
    expect(error.name).toBe('ApplicationError');
    expect(error.code).toBe(VALIDATION_ERROR.code);
    expect(statusCode).toBe(VALIDATION_ERROR.statusCode);
    expect(error.validationErrors).toEqual(expectedValidError);

    const user = await User.find({});
    expect(user.length).toBe(0);
  });

  test('should register new user to database.', async () => {
    /**
     * Was user added to db?
     * Was a userId returned?
     * StatusCode must be 201
     */
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const username = 'shraddha98';

    const {
      body: {
        success,
        data: { user },
      },
      statusCode,
    } = await request(app).post('/user').send({
      user: { email, password, username },
    });
    const savedUser = await User.find({ email });

    expect(success).toBe(true);
    expect(statusCode).toBe(201);
    expect(savedUser.length).toBe(1);
    expect(savedUser[0].email).toBe(user.email);
    expect(savedUser[0].username).toBe(user.username);
    expect(savedUser[0]._id.toString()).toBe(user._id);
    expect(savedUser[0].password).toBeTruthy();
  });
});
