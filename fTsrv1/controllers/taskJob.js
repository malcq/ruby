const db = require('../models/index');


/**
 * @swagger
* definitions:
 *   TaskJobModel:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 */

/**
 * @swagger
 *
 * /api/taskjob/:
 *   get:
 *     summary: GET filtered and sorted list of task jobs
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           description: STRINGIFIED filter object for where
 *           example: {"title": "string"}
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           example: [id, asc]
 *           collectionFormat: multi
 *           items:
 *              type: string
 *           description: sorting parameters
 *     tags:
 *       - taskJobs
 *     responses:
 *       200:
 *         description: taskJobs list
 *       500:
 *         description: error message probably wrong request
 */

const getTaskJobs = async (req, res) => {
  const filter = {
    title: {
      $iLike: `%${JSON.parse(req.query.filter).title}%`,
    },
  };

  try {
    const taskJobs = await db.taskJob.findAll({
      where: [filter],
      order: [req.query.sort],
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
    });
    return res.json(taskJobs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/taskjob/:
 *   post:
 *     summary: create TaskJob
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TaskJobModel'
 *     tags:
 *       - taskJobs
 *     responses:
 *       200:
 *         description: TaskJob created
 *       500:
 *         description: error message probably wrong request
 */

const postTaskJob = async (req, res) => {
  try {
    const newTaskJobPayload = req.body;
    const task = await db.taskJob.create(newTaskJobPayload);
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/taskjob/{id}:
 *   put:
 *     summary: update TaskJob
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: taskJob db Pkey
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TaskJobModel'
 *         description: new project object
 *         in: body
 *     tags:
 *       - taskJobs
 *     responses:
 *       200:
 *         description: TaskJob updated
 *       500:
 *         description: error message probably wrong request
 */

const putTaskJob = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const task = await db.taskJob.update(newData, {
      where: { id },
      individualHooks: true,
    });

    return res.json(task[1][0]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/taskjob/{id}:
 *   get:
 *     summary: get particukar TaskJob by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: taskJob db Pkey
 *     tags:
 *       - taskJobs
 *     responses:
 *       200:
 *         description: TaskJob
 *       500:
 *         description: error message probably wrong request
 */

const getTaskJob = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.taskJob.findOne({
      where: { id },
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
    });
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/taskjob/{id}:
 *   delete:
 *     summary: delete TaskJob by id
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: number
 *         description: taskJob db Pkey
 *     tags:
 *       - taskJobs
 *     responses:
 *       200:
 *         description: TaskJob deleted
 *       500:
 *         description: error message probably wrong request
 */

const deleteTaskJob = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.taskJob.destroy({ where: { id } });
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTaskJob,
  putTaskJob,
  postTaskJob,
  deleteTaskJob,
  getTaskJobs,
};
