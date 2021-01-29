const multer = require('multer');
const controller = require('../controllers/technology');
const isAuthorize = require('../middlewares/isAuthorize');
const isSalesOrManager = require('../middlewares/isSalesOrManager');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/uploads/technology_icons/');
  },
  filename(req, file, cb) {
    const { title } = req.params;
    const filename = `ic_${title}.svg`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', controller.getTechnologies);
  router.get('/:id', controller.getTechnology);
  router.post('/', isSalesOrManager, controller.postTechnology);
  router.put('/:id', isSalesOrManager, controller.putTechnology);
  router.put('/image/:title', isSalesOrManager, upload.single('image'), controller.newTechnologyImage);
  router.delete('/:id', isSalesOrManager, controller.deleteTechnology);
};
