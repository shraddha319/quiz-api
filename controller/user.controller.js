const { User } = require('../models/user.model');
const {
  sendResponse,
  deepMerge,
  ErrorTypes,
  ApplicationError,
} = require('../lib');

const { RESOURCE_NOT_FOUND } = ErrorTypes;

const postNewUser = async (req, res, next) => {
  const { user } = req.body;
  const savedUser = await User.create(user);
  return sendResponse({
    res,
    success: true,
    payload: { user: savedUser },
    statusCode: 201,
  });
};

const getUserById = (req, res) => {
  const { user } = req;
  return sendResponse({ res, payload: { user }, success: true });
};

const updateUserById = async (req, res, next) => {
  const { update } = req.body;
  const { user } = req;
  deepMerge(user, update);
  await user.save();
  return sendResponse({ res, success: true, statusCode: 204 });
};

const deleteUserById = async (req, res, next) => {
  const { user } = req;
  const removedUser = await user.remove();

  return sendResponse({
    res,
    success: true,
    statusCode: 200,
    // eslint-disable-next-line no-underscore-dangle
    payload: { userId: removedUser._id },
  });
};

const getUser = async (req, res, next) => {
  const email = req.header('email');
  const username = req.header('username');

  let user;
  if (email) user = await User.findOne({ email });
  else user = await User.findOne({ username });
  if (!user) return next(new ApplicationError(RESOURCE_NOT_FOUND));
  return sendResponse({ res, statusCode: 200 });
};

module.exports = {
  postNewUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUser,
};
