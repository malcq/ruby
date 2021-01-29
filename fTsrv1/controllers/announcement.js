const db = require('../models');
const { getIncludeModel, createFilter } = require('../utils/');
const { sendAdInGeneral } = require('../slackBot/messages');
const { saveImages, updateImages } = require('../utils/image');

const sendMessageToSlack = async (data) => {
  const { hidden = false, author_id } = data;
  const [image] = data.images;
  data.image = image;
  data.user = await db.user.findById(author_id);
  // hidden value can be string
  // eslint-disable-next-line eqeqeq
  if (hidden == 'false') {
    sendAdInGeneral(data);
  }
};

/**
 * @swagger
 * definitions:
 *   AnounsmentModel:
 *     type: object
 *     required:
 *       - link
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       hidden:
 *         type: boolean
 *       files:
 *         type: array
 *         items:
 *           type: string
 *       id:
 *         type: number
 */

/**
 * @swagger
 *
 * /api/announcement/{id}:
 *   get:
 *     summary: GET announcement by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: anounsment db Pkey
 *     tags:
 *       - anounsments
 *     responses:
 *       200:
 *         description: anounsment
 *       500:
 *         description: err message. probably wrong request data
 */

const getAnnouncement = async (req, res) => {
  try {
    const announcement = await db.announcement.findById(req.params.id);

    return res.json(announcement);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/announcement/:
 *   get:
 *     summary: GET filtered and sorted announcements list
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: STRINGIFIED filter object
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: current page
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: number
 *         description: rows per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           collectionFormat: multi
 *           description: rows per page
 *           items:
 *             type: string
 *     tags:
 *       - anounsments
 *     responses:
 *       200:
 *         description: anounsments
 *       500:
 *         description: err message. probably wrong request data
 */

const getAnnouncements = async (req, res) => {
  try {
    const params = JSON.parse(req.query.filter);
    const filter = createFilter(params);
    const { page, perPage, sort = [] } = req.query;

    const userData = getIncludeModel();

    const announcements = await db.announcement.findAndCountAll({
      ...filter,
      ...userData,
      offset: page && perPage ? (page - 1) * perPage : null,
      limit: perPage || null,
      order: [sort],
    });

    return res.json({
      data: announcements.rows,
      pagesCount: Math.ceil(announcements.count / perPage),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/announcement/:
 *   post:
 *     summary: create new anounsment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/AnounsmentModel'
 *     tags:
 *       - anounsments
 *     responses:
 *       200:
 *         description: anounsment created
 *       500:
 *         description: error message. Probably wrong request body
 */

const postAnnouncement = async (req, res) => {
  const {
    title, description, id: author_id, hidden, visitDate,
  } = req.body;
  const images = saveImages(req.files, { folder: '/public/uploads/announcement/', shrink: true });
  const data = {
    title,
    description,
    author_id,
    hidden,
    images,
    visitDate,
  };
  try {
    const announcement = await db.announcement.create(data);

    await sendMessageToSlack({
      ...data,
      id: announcement.toJSON().id,
    });
    return res.json({
      error: false,
      message: 'New announcement was successfully added',
      announcement,
    });
  } catch (err) {
    return res.status(500).json({ error: true, oops: true, message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/announcement/{id}:
 *   delete:
 *     summary: GET announcement by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: anounsment db Pkey
 *     tags:
 *       - anounsments
 *     responses:
 *       200:
 *         description: anounsment
 *       500:
 *         description: error message. Probably wrong request
 */

const deleteAnnouncement = async (req, res) => {
  try {
    await db.announcement.destroy({ where: { id: req.params.id } });
    return res.send(true);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/announcement/{id}:
 *   put:
 *     summary: create new anounsment
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: number
 *       required: true
 *       description: announsment db Pkey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/AnounsmentModel'
 *     tags:
 *       - anounsments
 *     responses:
 *       200:
 *         description: anounsment
 *       500:
 *         description: error message. Probably wrong request
 */

const putAnnouncement = async (req, res) => {
  try {
    const { files = [], body = {} } = req;
    const {
      title = '',
      description = '',
      oldImages = [],
      author_id,
      changedImages = [],
      visitDate,
      hidden = true,
    } = body;

    const images = updateImages(changedImages, oldImages, files, {
      folder: '/public/uploads/announcement/',
      shrink: true,
    });

    const data = {
      title,
      description,
      author_id,
      hidden,
      images,
      visitDate,
    };
    await db.announcement.update(data, { where: { id: req.params.id } });
    const result = await db.announcement.findById(req.params.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAnnouncement,
  getAnnouncements,
  postAnnouncement,
  deleteAnnouncement,
  putAnnouncement,
};
