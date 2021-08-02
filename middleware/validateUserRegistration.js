const mongoose = require('mongoose');
const { getAge } = require('../lib/index');

const validateDOB = (dob) => getAge(dob) >= 13;

const validateUniqueField = (pathname, model) => async (value) => {
  const result = await mongoose.models[model].countDocuments({
    [pathname]: [value],
  });
  return !result;
};

module.exports = { validateDOB, validateUniqueField };
