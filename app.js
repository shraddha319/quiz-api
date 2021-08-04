require('dotenv').config();

const express = require('express');
const { json } = require('body-parser');
const { PORT, NODE_ENV } = require('./config');
const { connectDB } = require('./lib/index');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const quizRouter = require('./routes/quiz.routes');
const historyRouter = require('./routes/history.routes');

connectDB();

const app = express();
const port = PORT || 3000;

app.use(json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/quiz', quizRouter);
app.use('/history', historyRouter);

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

if (NODE_ENV !== 'test')
  app.listen(port, () => {
    console.log('server listening on port: ', port);
  });
else module.exports = app;
