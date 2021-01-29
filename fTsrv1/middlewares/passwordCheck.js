const db = require('../models/index');
const hash = require('../utils/hash');

module.exports = (req, res, next) => {
  // TODO: dirty hotfix.
  // Need to check source of request or send additional flags within body
  // to use this middleware
  if (!req.body.password && req.path !== '/editUser') {
    req.passwordCheck = false;
    return next();
  }

  db.user.findOne({
    where: {
      $or: [
        { login: req.body.login },
        { email: req.body.login },
        { phone: req.body.login },
      ],
    },
    attributes: {
      exclude:
        ['updatedAt'],
    },
  })
    .then((user) => {
      if (user === null) {
        req.passwordCheck = null;
        return next();
      }

      if (!req.body.password && req.body.newPassword) {
        req.passwordCheck = false;
        return next();
      }

      if (
        req.body.password
        && user.get().password !== hash(req.body.password)
      ) {
        req.passwordCheck = false;
        return next();
      }
      req.passwordCheck = true;
      req.userData = user.get();
      return next();
    });
};
