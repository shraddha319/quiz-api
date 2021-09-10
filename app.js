require('dotenv').config();

const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const { PORT, NODE_ENV } = require('./config');
const { connectDB } = require('./lib');
const { errorHandler, notFoundHandler } = require('./middlewares');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const quizRouter = require('./routes/quiz.route');

if (NODE_ENV !== 'test') connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(json());
app.use(cors());
app.use('/quiz', quizRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

/**
 * 404 Error handler
 * Note: DO NOT MOVE. This should be the last route
 */
app.all('*', notFoundHandler);

/**
 * Error handling middleware
 * DO NOT MOVE
 */
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log('server listening on port: ', PORT);
});

module.exports = { app, server };
