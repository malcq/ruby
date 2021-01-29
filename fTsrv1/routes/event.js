const controller = require('../controllers/event');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', controller.getEvents);
  router.get('/:id', controller.getEvent);
  router.put('/:id', controller.putEvent);
  router.post('/', controller.postEvent);
  router.delete('/:id', isAdmin, controller.deleteEvent);
};
