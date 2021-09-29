const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  sendResponse,
  ErrorTypes,
  ApplicationError,
  generateToken,
} = require('../lib');
const { JWT_SECRET } = require('../config');
const User = require('../models/user.model');

const { AUTHENTICATION_ERROR, RESOURCE_NOT_FOUND } = ErrorTypes;

const loginUser = async (req, res, next) => {
  const credentials = req.body;
  const header = req.headers;

  if (header?.authorization) {
    const { userId } = jwt.verify(header.authorization, JWT_SECRET);
    const user = await User.findOne({ _id: userId });
    if (!user)
      return next(
        new ApplicationError(RESOURCE_NOT_FOUND, {
          message: `user not found`,
        }),
      );

    return sendResponse({
      res,
      success: true,
      payload: { user, authToken: header.authorization },
    });
  }

  const user = await User.findOne({ email: credentials.email });

  if (!user)
    return next(
      new ApplicationError(RESOURCE_NOT_FOUND, {
        message: `user not found`,
      }),
    );

  const isMatch = await bcrypt.compare(credentials.password, user.password);
  if (!isMatch) return next(new ApplicationError(AUTHENTICATION_ERROR));

  const authToken = generateToken({ userId: user._id, email: user.email });

  return sendResponse({
    res,
    success: true,
    payload: { user, authToken },
  });
};

module.exports = { loginUser };
