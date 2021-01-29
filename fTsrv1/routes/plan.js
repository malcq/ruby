const controller = require('../controllers/plan');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/:id', controller.getPlan);
  router.post('/', isAdmin, controller.postPlan);
  router.put('/:id', controller.putPlan);
  router.put('/taskJobInPlan/:id', controller.putTaskJobInPlan);
  router.delete('/:id', isAdmin, controller.deletePlan);
};
