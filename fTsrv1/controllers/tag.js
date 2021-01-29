const db = require('../models/index');

/**
 * @swagger
* definitions:
 *   TagModel:
 *     type: object
 *     properties:
 *       newTag:
 *         type: string
 *   TagModelTitle:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *   UpdateTagModel:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       newName:
 *         type: string
 */

/**
 * @swagger
 *
 * /api/tag/:
 *   get:
 *     summary: GET all tags
 *     tags:
 *       - tag
 *     responses:
 *       200:
 *         description: tags
 *       500:
 *         description: err message. probably invalid request body
 */

const getTags = async (req, res) => {
  try {
    const tags = await db.tag.findAll({
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
    });
    return res.json(tags);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tag/:
 *   post:
 *     summary: Create tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TagModel'
 *     tags:
 *       - tag
 *     responses:
 *       200:
 *         description: tag created
 *       500:
 *         description: err message. probably invalid request body
 */

const postTag = async (req, res) => {
  try {
    const { newTag } = req.body;
    const tag = await db.tag.create({ title: newTag });
    return res.json(tag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tag/:
 *   put:
 *     summary: Update tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UpdateTagModel'
 *     tags:
 *       - tag
 *     responses:
 *       200:
 *         description: tag updated
 *       500:
 *         description: err message. probably invalid request body
 */

const putTag = async (req, res) => {
  try {
    const newData = req.body;
    if (newData.newName !== null) {
      newData.title = newData.newName;
    }
    delete newData.newName;
    const tag = await db.tag.update(newData, {
      where: { title: req.body.name },
    });
    return res.json(tag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tag/{id}:
 *   get:
 *     summary: Get tag by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: tag's db pkey
 *         schema:
 *           type: number
 *     tags:
 *       - tag
 *     responses:
 *       200:
 *         description: tag
 *       500:
 *         description: err message. probably invalid request body
 */

const getTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await db.tag.findOne({ where: { id } });
    return res.json(tag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/tag/:
 *   delete:
 *     summary: Delete tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TagModelTitle'
 *     tags:
 *       - tag
 *     responses:
 *       200:
 *         description: tag deleted
 *       500:
 *         description: err message. probably invalid request body
 */
const deleteTag = async (req, res) => {
  try {
    const { title } = req.body;
    const tag = await db.tag.destroy({ where: { title } });
    return res.json(tag);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTag,
  putTag,
  postTag,
  deleteTag,
  getTags,
};
