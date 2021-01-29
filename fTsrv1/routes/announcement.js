const multer = require('multer');
const controller = require('../controllers/announcement');
const config = require('../config');
const isAuthorize = require('../middlewares/isAuthorize');
const isAdmin = require('../middlewares/isAdmin');

const upload = multer({ dest: './public/uploads/announcement' });


module.exports = (router) => {
  router.use(isAuthorize);
  router.get('/', controller.getAnnouncements);
  router.get('/:id', controller.getAnnouncement);
  router.post('/', isAdmin, upload.array('adIMG', config.quantityPicture), controller.postAnnouncement);
  router.put('/:id', isAdmin, upload.array('adIMG', config.quantityPicture), controller.putAnnouncement);
  router.delete('/:id', isAdmin, controller.deleteAnnouncement);
};
