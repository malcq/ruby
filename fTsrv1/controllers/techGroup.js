const _get = require('lodash/get');
const db = require('../models/index');

/**
 * @swagger
* definitions:
 *   TechGroupModel:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 */

/**
 * @swagger
 *
 * /api/tech-group/:
 *   get:
 *     summary: GET all tech groups
 *     tags:
 *       - techGroup
 *     responses:
 *       200:
 *         description: techGroups
 *       500:
 *         description: err message
 */

const getTechGroup = async (req, res) => {
  try {
    const includes = _get(req, 'query.includes', '');
    let options = {};

    if (includes === 'technologies') {
      options = {
        include: [{
          model: db.technology,
          include: [{
            model: db.techGroup,
          }],
        }],
      };
    }

    const groups = await db.techGroup.findAll(options);
    return res.json(groups);
  } catch (err) {
    console.log('Error in getTechGroup function:\n', err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tech-group/:
 *   post:
 *     summary: create new tech group
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TechGroupModel'
 *         description: new tech group object
 *     tags:
 *       - techGroup
 *     responses:
 *       200:
 *         description: tech group created
 *       500:
 *         description: err message
 */

const postTechGroup = async (req, res) => {
  try {
    const techGroup = await db.techGroup.create(req.body);
    return res.json(techGroup);
  } catch (err) {
    console.log('Error in postTechGroup function:\n', err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tech-group/:
 *   put:
 *     summary: update tech group
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: number
 *       description: db Pkey
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TechGroupModel'
 *         description: new tech group object
 *     tags:
 *       - techGroup
 *     responses:
 *       200:
 *         description: tech group updated
 *       500:
 *         description: err message
 */

const putTechGroup = async (req, res) => {
  try {
    await db.techGroup.update(req.body, { where: { id: req.params.id } });
    return res.send('Success');
  } catch (err) {
    console.log('Error in putTechGroup function:\n', err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tech-group/{id}:
 *   delete:
 *     summary: delete tech group
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: techGroup db pkey
 *     tags:
 *       - techGroup
 *     responses:
 *       200:
 *         description: tech group deleted
*       500:
 *         description: err message
 */

const deleteTechGroup = async (req, res) => {
  try {
    await db.techGroup.destroy({ where: { id: req.params.id } });
    return res.send('Success');
  } catch (err) {
    console.log('Error in deleteTechGroup function:\n', err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTechGroup,
  postTechGroup,
  putTechGroup,
  deleteTechGroup,
};
