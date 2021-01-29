const controller = require('../controllers/extra');
const isAuthorize = require('../middlewares/isAuthorize');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', controller.getExtraHours);
  router.post('/', controller.postExtraHours);
  router.put('/:id', controller.putExtraHours);
  router.delete('/:id', controller.deleteExtraHours);
};
