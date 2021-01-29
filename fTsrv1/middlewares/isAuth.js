const jwt = require('jsonwebtoken');
const config = require('../config/index');

module.exports = function isAuth(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies['x-access-token'];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token.',
      });
    }
    req.user = decoded;
    next();
  });
};
