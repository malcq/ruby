const validator = require('email-validator');

module.exports = (req, res, next) => {
  for (const key in req.body) {
    if (req.body[key] === 'null') {
      req.body[key] = null;
    }
  }
  if (!req.body.email) { return next(); }
  if (validator.validate(req.body.email)) {
    return next();
  }
  return res.status(500).send('email error');
};
