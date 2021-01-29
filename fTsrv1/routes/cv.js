const controller = require('../controllers/cv');

const isAuthorize = require('../middlewares/isAuthorize');
const isSalesOrManager = require('../middlewares/isSalesOrManager');

module.exports = (router) => {
  router.use(isAuthorize);
  router.post('/', isSalesOrManager, controller.postCV);
};
