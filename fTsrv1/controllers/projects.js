const db = require('../models/index');
const { saveImages, updateImages, parseStringToArray } = require('../utils/image');
const { createFilter } = require('../utils');

/**
 * @swagger
 * definitions:
 *   ProjectModel:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       href:
 *         type: string
 *       description:
 *         type: string
 *       users:
 *         type: string
 *         in: body
 *         description: string of ids with ',' delimeter
 *       technologies:
 *         type: string
 *         in: body
 *         description: string of ids with ',' delimeter
 *       projectIMG:
 *         type: string
 *         format: binary
 *         description: file
 *       changedImages:
 *         type: array
 *         items:
 *           type: string
 *       oldImages:
 *         type: array
 *         items:
 *           type: string
 *       role:
 *         type: string
 *         description: stringified array of objects
 */

/**
 * @swagger
 *
 * /api/projects/:
 *   get:
 *     summary: GET filtered array of Projects
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: filter
 *         required: true
 *         allowReserved: true
 *         schema:
 *           type: string
 *           example: {"users" : [1,2,3], "technologies": [2,3,4]}
 *           description: filter for where STRINGIFIED object
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           collectionFormat: multi
 *           required: true
 *           items:
 *             type: "string"
 *           description: sorting parameters
 *           example: ['id', 'ASC']
 *     tags:
 *       - projects
 *     responses:
 *       200:
 *         description: Filtered and ordered list of projects
 *       500:
 *         description: Error message. Probably invalid request data
 *
 */

const getProjects = async (req, res) => {
  try {
    const data = req.query;
    data.filter = JSON.parse(data.filter);
    const { users, technologies } = data.filter;

    let whereTechologies;
    if (technologies) {
      whereTechologies = technologies.length && technologies !== undefined ? {
        id: {
          [db.Sequelize.Op.or]: technologies,
        },
      } : {};
    }
    const projectFilter = createFilter(data.filter);

    let projects = await db.project.findAll({
      ...projectFilter,
      include: [{
        model: db.user,
        required: (users === undefined) ? false : !!(users.length),
        where: makeFilterUsers(users),
        attributes: ['id', 'login', 'firstName', 'lastName'],
        // through: {
        //     where: {$and: [{user_id :1},{user_id :2} ]},
        //     // required: true,
        // },
      },
      {
        model: db.technology,
        required: (technologies === undefined) ? false : !!(technologies.length),
        where: whereTechologies,
        attributes: ['id', 'title'],
      },
      ],
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
      order: [data.sort],
    });
    const arrayFilter = [];
    projects.forEach((el) => {
      arrayFilter.push(el.id);
    });
    projects = await db.project.findAll({
      where: { id: arrayFilter },
      include: [{
        model: db.user,
        required: false,
        attributes: ['id', 'login', 'firstName', 'lastName'],
        through: {
          attributes: [],
        },
      },
      {
        model: db.technology,
        required: false,
        attributes: ['id', 'title'],
        through: {
          attributes: [],
        },
      },
      ],
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
      order: [data.sort],
    });
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/projects/project/{id}:
 *   get:
 *     summary: Get particular project by it's db ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: project db PK
 *         required: true
 *         schema:
 *           type: number
 *     tags:
 *       - projects
 *     responses:
 *       200:
 *         description: project with selected id or null if missmatched id
 *       500:
 *         description: Error message. Probably invalid request data
 *
 */

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.project.findById(id, {
      include: [
        {
          model: db.user,
          required: false,
          attributes: ['id', 'login', 'firstName', 'lastName'],
          through: {
            attributes: [],
          },
        },
        {
          model: db.technology,
          required: false,
          attributes: ['id', 'title'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/projects/{userId}:
 *   get:
 *     summary: Get projects related to particular user
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: user db PK
 *         required: true
 *         schema:
 *           type: number
 *     tags:
 *       - projects
 *     responses:
 *       200:
 *         description: List of selected user's projects
 *       500:
 *         description: Error message
 *
 */

const getProjectForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const projects = await db.project.findAll({
      include: [{
        model: db.user,
        where: { id: userId },
        attributes: ['id', 'login', 'firstName', 'lastName'],
        through: {
          attributes: [],
        },
      },
      {
        model: db.technology,
        required: false,
        attributes: ['id', 'title'],
        through: {
          attributes: [],
        },
      },
      ],
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },

    });
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/projects/:
 *   post:
 *     summary: Create new project
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/ProjectModel'
 *           encoding:
 *             imagesSrc:
 *               contentType: image/png, image/jpeg
 *             role:
 *               contentType: application/json
 *       description: new project object
 *     tags:
 *       - projects
 *     responses:
 *       200:
 *         description: project created
 *       500:
 *         description: err message. probably invalid request body
 */

const postProjects = async (req, res) => {
  try {
    const newProjectPayload = req.body;
    let { technologies, users } = newProjectPayload;
    const { role } = newProjectPayload;
    delete newProjectPayload.technologies;
    delete newProjectPayload.users;
    if (technologies) {
      technologies = technologies.split(',');
    }
    if (users) {
      users = users.split(',');
    }

    newProjectPayload.role = JSON.parse(role);

    newProjectPayload.images = saveImages(req.files, { folder: '/public/uploads/projects/' });

    let project = await db.project.create(newProjectPayload);
    if (technologies.length) {
      await project.setTechnologies(technologies);
    }

    if (users) {
      await project.setUsers(users);
    }
    project = await db.project.findById(project.id, {
      include: [{ model: db.technology },
        {
          model: db.user,
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
      ],
    });
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/projects/{id}:
 *   put:
 *     summary: Update existing project
 *     parameters:
 *     - in: path
 *       name: id
 *       description: db Pkey of project
 *       schema:
 *         type: number
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/ProjectModel'
 *           encoding:
 *             imagesSrc:
 *               contentType: image/png, image/jpeg
 *     tags:
 *       - projects
 *     responses:
 *       200:
 *         description: project updated
 *       500:
 *         description: err message. probably invalid request body
 */

const putProjects = async (req, res) => {
  try {
    const newDataPayload = req.body;
    let { technologies, users } = newDataPayload;
    const { changedImages, oldImages, role } = newDataPayload;
    delete newDataPayload.technologies;
    delete newDataPayload.users;

    users = parseStringToArray(users);
    technologies = parseStringToArray(technologies);
    newDataPayload.role = JSON.parse(role);

    newDataPayload.images = updateImages(changedImages,
      oldImages,
      req.files,
      { folder: '/public/uploads/projects/' });
    delete newDataPayload.oldImages;
    delete newDataPayload.changedImages;

    const whereProject = createFilter(req.params);

    await db.project.update(newDataPayload, whereProject);

    const project = await db.project.findOne({
      ...whereProject,
      include: [{ model: db.technology }, {
        model: db.user,
        attributes: ['id', 'login', 'firstName', 'lastName'],
      }],
    });
    await project.setTechnologies(technologies);
    await project.setUsers(users);
    return res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


/**
 * @swagger
 *
 * /api/project/{id}:
 *   delete:
 *     summary: delete particular project
 *     parameters:
 *       - in: path
 *         name: id
 *         description: project db PK
 *         required: true
 *         schema:
 *           type: number
 *     tags:
 *       - projects
 *     responses:
 *       200:
 *         description: project deleted
 *       500:
 *         description: err message
 *
 */

const deleteProject = async (req, res) => {
  try {
    const removeProject = await db.project.destroy({ where: { id: req.params.id } });
    return res.json(removeProject);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const makeFilterUsers = (filter) => {
  const filterParams = {};
  if (filter === undefined) {
    return filterParams;
  }
  if (filter.length) {
    filterParams.$and = {
      id: filter,
    };
  }

  return filterParams;
};

module.exports = {
  getProject,
  getProjects,
  getProjectForUser,
  putProjects,
  postProjects,
  deleteProject,
};
