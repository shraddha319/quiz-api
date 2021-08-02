require('dotenv').config();

const express = require('express');
const { json } = require('body-parser');
const { PORT } = require('./config');
const { connectDB } = require('./lib/index');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');

connectDB();

const app = express();
const port = PORT || 3000;

app.use(json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/auth', authRouter);
app.use('/user', userRouter);

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

app.listen(port, () => {
  console.log('server listening on port: ', port);
});
