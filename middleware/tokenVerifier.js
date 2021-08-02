const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const tokenVerifier = (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const decoded = jwt.verify(authToken, JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = tokenVerifier;
