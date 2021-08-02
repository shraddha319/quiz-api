/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { User } = require('../models/user.model');

app.listen(3001, () => {
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
  await mongoose.connection.db.dropCollection('users');
});

describe('testing /user endpoint', () => {
  test('sample test', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hello, world!');
  });

  test('should register new user to database on POST /user', async () => {
    /**
     * Was user added to db?
     * Was a userId returned?
     * StatusCode must be 201
     */
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const firstName = 'shraddha98';
    const DOB = '1998-09-21';

    const {
      body: {
        data: { user },
      },
      statusCode,
    } = await request(app).post('/user').send({
      user: { email, password, firstName, DOB },
    });
    const savedUser = await User.findOne({ email });
    expect(savedUser.email).toBe(email);
    expect(user._id).toBeTruthy();
    expect(statusCode).toBe(201);
  });

  test('should not register user if required fields are absent on POST /user', async () => {
    /**
     * email, password, first name, dob are required fields
     * should give VALIDATION_ERROR with status code 400
     */
    try {
      await request(app).post('/user').send({ user: {} });
    } catch (error) {
      expect(error.success).toBe(false);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
    }
    const user = await User.find({});
    expect(user.length).toBe(0);
  });

  test('should not register user if email is not unique', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const firstName = 'shraddha98';
    const DOB = '1998-09-21';

    try {
      await request(app)
        .post('/user')
        .send({ user: { email, password, firstName, DOB } });
      await request(app)
        .post('/user')
        .send({ user: { email, password, firstName, DOB } });
    } catch (error) {
      expect(error.success).toBe(false);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe(`${email} already exists`);
      expect(error.statusCode).toBe(400);
    }

    const user = await User.find({});
    expect(user.length).toBe(1);
  });

  test('should not register user if not older than 13 years', async () => {
    const email = 'shraddha1998@gmail.com';
    const password = 'shraddha1998';
    const firstName = 'shraddha98';
    const DOB = '2011-09-21'; // 10 years old

    try {
      await request(app)
        .post('/user')
        .send({ user: { email, password, firstName, DOB } });
    } catch (error) {
      expect(error.success).toBe(false);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('User must be atleast 13 years of age.');
      expect(error.statusCode).toBe(400);
    }

    const user = await User.find({});
    expect(user.length).toBe(0);
  });

  test("should not register user if password doesn't meet criteria", async () => {
    const email = 'shraddha1998@gmail.com';
    const password = '1998';
    const firstName = 'shraddha98';
    const DOB = '2011-09-21'; // 10 years old

    try {
      await request(app)
        .post('/user')
        .send({ user: { email, password, firstName, DOB } });
    } catch (error) {
      expect(error.success).toBe(false);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('Password must be atleast 8 characters long.');
      expect(error.statusCode).toBe(400);
    }

    const user = await User.find({});
    expect(user.length).toBe(0);
  });
});
