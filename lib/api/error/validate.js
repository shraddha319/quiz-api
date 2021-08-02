/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { getAge } = require('../../util/utils');

const validate = async (input, rules, model, errors) => {
  for (const key of Object.keys(rules)) {
    if (rules[key]?.required && !input[key]) {
      errors.push(`${key} is a required field.`);
    }
    if (rules[key]?.unique) {
      const result = await model.find({ [key]: input[key] });
      if (result?.length > 0)
        errors.push(`${key}: ${input[key]} is already in use.`);
    }
    if (key === 'DOB' && input[key] && getAge(input[key]) < 18) {
      errors.push('input must be 18 or above.');
    }
    if (key === 'password' && input[key] && input[key].length < 8) {
      errors.push('password must be atleast 8 characters long.');
    }
  }
};

module.exports = validate;
