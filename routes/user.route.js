const express = require('express');
const { catchAsync } = require('../lib');
const { validateUserId, tokenVerifier, validate } = require('../middlewares');
const {
  postUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../validations/user.validation');
const scoresRouter = require('./scores.route');

const router = express.Router();

router.route('/').post(validate(createUser, 'User'), catchAsync(postUser));

router.use('/:userId', catchAsync(validateUserId), tokenVerifier);

router
  .route('/:userId')
  .get(validate(getUserById, 'User'), getUser)
  .post(validate(updateUserById, 'User'), catchAsync(updateUser))
  .delete(validate(deleteUserById, 'User'), catchAsync(deleteUser));

router.use('/:userId/scores', scoresRouter);

module.exports = router;
