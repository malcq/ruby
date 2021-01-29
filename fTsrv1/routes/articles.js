const controller = require('../controllers/articles');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', controller.getArticles);
  // router.get('/:id', controller.getArticle);
  router.post('/', controller.postArticle);
  router.delete('/:id', isAdmin, isAuthorize, controller.deleteArticle);
};
