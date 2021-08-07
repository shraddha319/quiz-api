const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {
  validateUniqueField,
} = require('../middleware/validateUserRegistration');
const { SALT_WORK_FACTOR } = require('../config');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is a required field.'],
  },
  email: {
    type: String,
    required: [true, 'Email is a required field.'],
  },
  password: {
    type: String,
    required: [true, 'Password is a required field.'],
    minLength: [8, 'Password must be atleast 8 characters long.'],
  },
});

/**
 * unique is not a validator. Only indicates it can be used for creating mongodb index
 * email - immutable, unique
 * password - 8 char, alpha + special
 * firstname, lastname - only alphabets
 * DOB - age above 13
 */

userSchema
  .path('email')
  .validate({
    validator: validateUniqueField('email', 'User'),
    message: '{VALUE} already exists',
    type: 'unique',
  });

userSchema
  .path('username')
  .validate({
    validator: validateUniqueField('username', 'User'),
    message: '{VALUE} already exists',
    type: 'unique',
  });

userSchema.post('validate', async (user, next) => {
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(Number(SALT_WORK_FACTOR));
  user.password = await bcrypt.hash(user.password, salt);
  return next();
});

/**
 * DO NOT MOVE
 * .model() must be called after adding everything to schema, including hooks
 */
const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };
