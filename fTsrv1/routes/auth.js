const controller = require('../controllers/auth');
const uniqueLogin = require('../middlewares/uniqueLogin');
const emailvalidation = require('../middlewares/emailValidation');
const passwordCheck = require('../middlewares/passwordCheck');

module.exports = (router) => {
  router.post('/signin', passwordCheck, controller.singIn);
  router.post('/signup', emailvalidation, uniqueLogin, controller.singUp);
  router.post('/authorize', controller.authorize);
  router.post('/password_restore', controller.passwordRestore);
  router.post('/reset/:token', controller.passwordReset);
};
