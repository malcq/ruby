const db = require('../models/index');

module.exports = (req, res, next) => {
  let { login } = req.body;

  if (req.body.newLogin !== undefined) {
    if (req.body.login === req.body.newLogin || req.body.newLogin === null) {
      return next();
    }
    login = req.body.newLogin;
  }

  db.user.findOne({ where: { login } })
    .then((user) => {
      if (user == null) {
        return next();
      }
      return res.status(500).send('login error');
    });
};
