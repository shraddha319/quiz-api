/* eslint-disable consistent-return */
const _ = require('lodash');

const getAge = (birthDateString) => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const deepMerge = (source, update) => {
  _.mergeWith(source, update, (sourceValue, updateValue) => {
    if (_.isArray(sourceValue)) return sourceValue.concat(updateValue);
  });
};

module.exports = {
  deepMerge,
  getAge,
};
