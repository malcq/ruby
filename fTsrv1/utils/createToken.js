const jwt = require('jsonwebtoken');
const config = require('../config/index');

module.exports = (user, secret) => jwt.sign(user, secret, {
  expiresIn: config.expiresIn, // expires in 7 days
});
