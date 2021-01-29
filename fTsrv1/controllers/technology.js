const _get = require('lodash/get');
const db = require('../models/index');

/**
 * @swagger
* definitions:
 *   TechnologyModel:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       group_id:
 *         type: number
 */

/**
 * @swagger
 *
 * /api/technology/:
 *   get:
 *     summary: GET all technologies
 *     produces:
 *       - application/json
 *     tags:
 *       - technologies
 *     responses:
 *       200:
 *         description: technologies list
 *       500:
 *         description: error message
 */

const getTechnologies = async (req, res) => {
  try {
    const query = _get(req, 'query', {});
    let options = {};

    if (query.group) {
      options = {
        where: {
          group_id: +query.group || null,
        },
      };
    }

    const technologies = await db.technology.findAll({
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
      ...options,
    });
    return res.json(technologies);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tecnology/:
 *   post:
 *     summary: Create new tecnology
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TechnologyModel'
 *     tags:
 *       - technologies
 *     responses:
 *       200:
 *         description: technologies
 *       500:
 *         description: error message
 */

const postTechnology = async (req, res) => {
  try {
    const newTechnology = req.body;
    const technology = await db.technology.create(newTechnology);
    return res.json(technology);
  } catch (err) {
    console.log('Error in postTechnology function:\n', err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tecnology/{id}:
 *   put:
 *     summary: Create new tecnology
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: tecnology db Pkey
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TechnologyModel'
 *         description: new tecnology object
 *     tags:
 *       - technologies
 *     responses:
 *       200:
 *         description: technologies
 *       500:
 *         description: error message
 */

const putTechnology = async (req, res) => {
  try {
    await db.technology.update(req.body, { where: { id: req.params.id } });
    return res.send('Success');
  } catch (err) {
    console.log('Error in putTechnology function:\n', err);
    return res.status(500);
  }
};

const newTechnologyImage = async (req, res) => {
  const { title } = req.params;
  const image = `/public/uploads/technology_icons/ic_${title}.svg`;
  return res.json(image);
};

const getTechnology = async (req, res) => {
  try {
    const { title } = req.body;
    const technology = await db.technology.findOne({ where: { title } });
    return res.json(technology);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tecnology/{id}:
 *   delete:
 *     summary: delete technology by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: trre
 *         schema:
 *           type: number
 *     tags:
 *       - technologies
 *     responses:
 *       200:
 *         description: delete technology
 *       500:
 *         description: error message
 */

const deleteTechnology = async (req, res) => {
  try {
    await db.technology.destroy({ where: { id: req.params.id } });
    return res.send('Success');
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTechnology,
  putTechnology,
  postTechnology,
  deleteTechnology,
  getTechnologies,
  newTechnologyImage,
};
