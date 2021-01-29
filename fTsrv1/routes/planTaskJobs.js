const controller = require('../controllers/planTaskJobs');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/getTimeFrames', isAdmin, controller.getPlanTaskJobsTimeFrames);
};
