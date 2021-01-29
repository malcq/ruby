const controller = require('../controllers/skills');

const isAuthorize = require('../middlewares/isAuthorize');
const isSalesOrManager = require('../middlewares/isSalesOrManager');

module.exports = (router) => {
  router.use(isAuthorize);
  router.get('/', isSalesOrManager, controller.getSkills);
};
