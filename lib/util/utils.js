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

/**
 * Returns an object containing the passed object properties
 * @param {Object} object
 * @param {String[]} keys
 * @returns {Object}
 */
const pick = (object, keys) =>
  keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});

module.exports = {
  deepMerge,
  getAge,
  pick,
};
