const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../config');

const generateToken = (payload, overrides) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    ...overrides,
  });
  return token;
};

/**
 * payload: userId, email, username(optional)
 * default expiry: 24 hrs
 */

module.exports = generateToken;
