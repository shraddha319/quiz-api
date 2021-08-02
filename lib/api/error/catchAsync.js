const catchAsync = (callback) => (req, res, next) => {
  callback(req, res, next).catch(next);
};

module.exports = catchAsync;
