const { AccessError } = rootRequire('errors');

/**
 * Middleware to check user admin rights
 *
 * @param   {Request}   req    The express Request object
 * @param   {Response}  res    The express Response object
 * @param   {Function}  next   The express middleware callback function
 * @return  {*}                The result of next() call
 */
module.exports = function(req, res, next) {
  const { user } = req;

  if (!user.isAdmin()) {
    return next(new AccessError('not_permitted', 'Access not permitted'));
  }

  next();
};
