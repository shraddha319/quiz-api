/* eslint-disable no-unused-vars */
const express = require('express');
const { catchAsync } = require('../lib/index');
const validateUserId = require('../middleware/validateUserId');
const tokenVerifier = require('../middleware/tokenVerifier');
const {
  postNewUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controller/user.controller');

const router = express.Router();

router.route('/').post(catchAsync(postNewUser));

router.use('/:userId', catchAsync(validateUserId), tokenVerifier);

router
  .route('/:userId')
  .get(getUserById)
  .post(catchAsync(updateUserById))
  .delete(catchAsync(deleteUserById));

module.exports = router;
