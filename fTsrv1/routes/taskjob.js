const controller = require('../controllers/taskJob');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', isAdmin, controller.getTaskJobs);
  router.get('/:id', isAdmin, controller.getTaskJob);
  router.put('/:id', isAdmin, controller.putTaskJob);
  router.post('/', isAdmin, controller.postTaskJob);
  router.delete('/:id', isAdmin, controller.deleteTaskJob);
};
