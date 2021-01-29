const controller = require('../controllers/techGroup');
const isAuthorize = require('../middlewares/isAuthorize');
const isSalesOrManager = require('../middlewares/isSalesOrManager');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', controller.getTechGroup);
  router.post('/', isSalesOrManager, controller.postTechGroup);
  router.put('/:id', isSalesOrManager, controller.putTechGroup);
  router.delete('/:id', isSalesOrManager, controller.deleteTechGroup);
};
