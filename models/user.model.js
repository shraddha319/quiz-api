const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const { SALT_WORK_FACTOR } = require('../config');

const userSchema = Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
});

userSchema.statics.isEmailTaken = async function (email, excludeId) {
  const user = await this.findOne({ email, _id: { $ne: excludeId } });
  return Boolean(user);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(Number(SALT_WORK_FACTOR));
    user.password = await bcrypt.hash(user.password, salt);
  }
  return next();
});

/**
 * DO NOT MOVE
 * .model() must be called after adding everything to schema, including hooks
 */

module.exports = model('User', userSchema);
