const multer = require('multer');
const controller = require('../controllers/projects');

const upload = multer({ dest: './public/uploads/projects' });
const isAuthorize = require('../middlewares/isAuthorize');
const isSalesOrManager = require('../middlewares/isSalesOrManager');

module.exports = (router) => {
  router.use(isAuthorize);

  router.get('/', isSalesOrManager, controller.getProjects);
  router.get('/project/:id', controller.getProject);
  router.get('/:id', controller.getProjectForUser);
  router.put('/:id', isSalesOrManager, upload.array('projectIMG', 5), controller.putProjects);
  router.post('/', isSalesOrManager, upload.array('projectIMG', 5), controller.postProjects);
  router.delete('/:id', isSalesOrManager, controller.deleteProject);
};
