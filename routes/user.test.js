/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { User } = require('../models/user.model');
const { ErrorTypes } = require('../lib/index');

const { VALIDATION_ERROR } = ErrorTypes;

const server = app.listen(3001, () => {
  console.log('listening on port 3001');
});

beforeAll(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://shraddha:Shekar@560037BEN@cluster0.xnwmi.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
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
