const { User } = require('../models/user.model');
const { sendResponse, deepMerge } = require('../lib/index');

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
  // res.status(204).json({ status: 'success' });
  return sendResponse({ res, success: true, statusCode: 204 });
};

const deleteUserById = async (req, res, next) => {
  const { user } = req;
  const removedUser = await user.remove();
  // res.json({
  //   status: 'success',
  //   data: {
  //     userId: removedUser._id,
  //   },
  // });
  return sendResponse({
    res,
    success: true,
    statusCode: 200,
    // eslint-disable-next-line no-underscore-dangle
    payload: { userId: removedUser._id },
  });
};

module.exports = {
  postNewUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
