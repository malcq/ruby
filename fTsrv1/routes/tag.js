const controller = require('../controllers/tag');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', controller.getTags);
  router.get('/:id', controller.getTag);
  router.put('/', controller.putTag);
  router.post('/', controller.postTag);
  router.delete('/', isAdmin, controller.deleteTag);
};
