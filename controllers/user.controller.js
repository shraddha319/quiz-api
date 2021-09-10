const User = require('../models/user.model');
const { sendResponse, deepMerge } = require('../lib');

const postUser = async (req, res) => {
  const savedUser = await User.create(req.body);
  return sendResponse({
    res,
    success: true,
    payload: { user: savedUser },
    statusCode: 201,
  });
};

const getUser = (req, res) => {
  const { user } = req;
  return sendResponse({ res, payload: { user }, success: true });
};

const updateUser = async (req, res) => {
  const { user, body } = req;
  deepMerge(user, body);
  await user.save();
  return sendResponse({ res, success: true, statusCode: 204 });
};

const deleteUser = async (req, res) => {
  const { user } = req;
  await user.remove();
  return sendResponse({
    res,
    success: true,
    statusCode: 204,
  });
};

module.exports = {
  postUser,
  getUser,
  updateUser,
  deleteUser,
};
