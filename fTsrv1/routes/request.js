const controller = require('../controllers/request');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');
const isSalesOrManager = require('../middlewares/isSalesOrManager');

module.exports = (router) => {
  router.use(isAuthorize);

  router.post('/', controller.postRequest);
  router.put('/', controller.putRequest);
  router.get('/', isSalesOrManager, controller.getRequests);
  router.get('/:id', controller.getRequestsForUser);
  router.delete('/:id', isAdmin, controller.deleteRequest);
};
