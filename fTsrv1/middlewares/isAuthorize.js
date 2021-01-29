const jwt = require('jsonwebtoken');
const db = require('../models/index');
const config = require('../config/index');

module.exports = function isAuthorize(req, res, next) {
  try {
    if (req.method === 'OPTIONS') { return next(); }

    const token = req.headers.authorization.split('Bearer ')[1];
    const decoded = jwt.verify(token, config.secret);

    db.user
      .findOne({
        where: { id: decoded.id },
        attributes: {
          exclude: ['updatedAt'],
        },
      })
      .then((user) => {
        if (user === null) {
          return res.sendStatus(404);
        }
        if (user.status !== 'active') {
          return res.sendStatus(403);
        }
        req.user = user.get();
        next();
      });
  } catch (err) {
    return res.sendStatus(406);
  }
};
