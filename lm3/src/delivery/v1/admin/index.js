const { Router } = require('express');

const createControllers = rootRequire('delivery/lib/controllers');

/**
 * Initializes admin API V1
 *
 * @param   {App}     app  App instance
 * @returns {Router}       Express Router instance
 */
module.exports = function adminAPIV1(app) {
  const router = Router();
  const controllers = createControllers(app, require('./controllers'));

  router.param('id', async (req, res, next, id) => {
    const { path } = req.route;
    let entity;

    if (path.includes('users')) {
      try {
        entity = await app.api.Users.findById(id);
      }
      catch(error) {
        throw Error(error);
      }
    }

    req.entity = entity;

    next();
  });

  router.route('/users')
      .get(controllers['users'].list)
      .post(controllers['users'].create);

  router.route('/users/:id')
      .put(controllers['users'].update)
      .delete(controllers['users'].destroy);

  return router;
};
