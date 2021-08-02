const ApplicationError = require('./api/error/applicationError');
const createError = require('./api/error/createError');
const catchAsync = require('./api/error/catchAsync');
const { deepMerge, getAge } = require('./util/utils');
const connectDB = require('./db/db.connect');
const ErrorTypes = require('./api/error/types');
const sendResponse = require('./api/res/sendResponse');
const generateToken = require('./api/auth/generateToken');

module.exports = {
  ApplicationError,
  catchAsync,
  ErrorTypes,
  createError,
  deepMerge,
  getAge,
  connectDB,
  sendResponse,
  generateToken,
};
