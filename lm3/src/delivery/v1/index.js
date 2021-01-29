const { Router } = require('express');

const createControllers = rootRequire('delivery/lib/controllers');

/**
 * Initializes API V1
 *
 * @param   {App}     app  App instance
 * @returns {Router}       Express Router instance
 */
module.exports = function APIV1(app) {
  const router = Router();
  const controllers = createControllers(app, require('./controllers'));

  /**
   * Catch requests to routes with `id` param and prefetch
   * appropriate entity
   */
  router.param('id', async (req, res, next, id) => {
    //const { path } = req.route;
    //let entity;

    // An example of fetching entity depending on request path
    // if (path.includes('tickets')) {
    //   entity = await app.api.Tickets.findById(id);
    // }

    //req.entity = entity;

    next();
  });


  router.post('/sign-in', controllers['auth'].signIn);
  router.post('/sign-up', controllers['auth'].signUp);
  router.put('/confirm-email', controllers['auth'].confirmEmail);
  router.put('/recover-password', controllers['auth'].recoverPassword);
  router.put('/reset-password', controllers['auth'].resetPassword);

  router.get('/user/profile', controllers['users'].profile);
  router.put('/user/change-password', controllers['users'].changePassword);

  return router;
};
