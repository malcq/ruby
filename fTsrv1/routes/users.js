const multer = require('multer');
const passwordCheck = require('../middlewares/passwordCheck');
const controller = require('../controllers/users');

const upload = multer({ dest: './public/uploads/' });
const uniqueLogin = require('../middlewares/uniqueLogin');
const emailvalidation = require('../middlewares/emailValidation');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', controller.getUsers);
  router.get('/:login', controller.getUser);
  router.put('/editUser', upload.single('avatarIMG'), passwordCheck, uniqueLogin, emailvalidation, controller.editUser);
  router.put('/avatar/:id', upload.single('avatarIMG'), controller.newAvatar);
  router.put('/adminChange/:id', isAdmin, controller.adminChange);
  router.delete('/:id', isAdmin, controller.deleteUser);
};
