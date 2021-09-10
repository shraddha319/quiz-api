const bcrypt = require('bcrypt');
const {
  sendResponse,
  ErrorTypes,
  ApplicationError,
  generateToken,
} = require('../lib');
const User = require('../models/user.model');

const { AUTHENTICATION_ERROR, RESOURCE_NOT_FOUND } = ErrorTypes;

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return next(
      new ApplicationError(RESOURCE_NOT_FOUND, {
        message: `${email} not found`,
      }),
    );

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ApplicationError(AUTHENTICATION_ERROR));

  const authToken = generateToken({ userId: user._id, email: user.email });

  return sendResponse({
    res,
    success: true,
    payload: { user, authToken },
  });
};

module.exports = { loginUser };
