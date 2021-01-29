module.exports = function isAdmin(req, res, next) {
  try {
    if (req.user.role === 'manager' || req.user.role === 'admin' || String(req.user.id) === String(req.params.id)) {
      return next();
    }
    return res.sendStatus(418);
  } catch (err) {
    return res.sendStatus(418);
  }
};
