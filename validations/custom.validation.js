const objectId = (value, helpers) => {
  const regexp = /^[0-9a-zA-Z]{24}$/;
  if (!regexp.test(value)) {
    return helpers.message('Invalid Id');
  }
  return value;
};

const password = (value, helpers) => {
  const regexp = /[a-zA-Z]/;
  if (value.length < 8) {
    return helpers.message('Password must be atleast 8 characters long');
  }
  if (!regexp.test(value)) {
    return helpers.message('password must contain letters only');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
