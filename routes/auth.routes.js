const express = require('express');
const bcrypt = require('bcrypt');
const {
  catchAsync,
  sendResponse,
  ErrorTypes,
  ApplicationError,
  generateToken,
} = require('../lib/index');
const { User } = require('../models/user.model');

const router = express.Router();
const {
  INVALID_PARAMETERS,
  AUTHENTICATION_ERROR,
  RESOURCE_NOT_FOUND,
} = ErrorTypes;

router.route('/login').post(
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(
        new ApplicationError(INVALID_PARAMETERS, {
          message: 'Email and password are required to authenticate',
        }),
      );

    const user = await User.findOne({ email });

    if (!user)
      return next(
        new ApplicationError(RESOURCE_NOT_FOUND, {
          message: 'User does not exist.',
        }),
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ApplicationError(AUTHENTICATION_ERROR));
    /** generate jwt token */
    const authToken = generateToken({ userId: user._id, email: user.email });

    return sendResponse({
      res,
      success: true,
      payload: { userID: user._id, authToken },
    });
  }),
);

module.exports = router;
