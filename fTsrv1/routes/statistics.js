const controller = require('../controllers/statistics');
const isAuthorize = require('../middlewares/isAuthorize');
const isManagerOrOwner = require('../middlewares/isManagerOrOwner');

module.exports = (router) => {
  router.get('/holiday/:id', isAuthorize, isManagerOrOwner, controller.getStatisticForUserHoliday);
  router.get('/:id', isAuthorize, isManagerOrOwner, controller.getStatisticsForUser);
};
