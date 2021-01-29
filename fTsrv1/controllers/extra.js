const moment = require('moment');
const db = require('../models/index');
const { notifyAboutNewRequestOrExtra } = require('../slackBot/messages.js');
const { rtm } = require('../slackBot/index.js');

/**
 * @swagger
 * definitions:
 *   ExtraHoursModel:
 *     type: object
 *     required:
 *       - link
 *     properties:
 *       date:
 *         type: string
 *         format: date-time
 *       description:
 *         type: string
 *       start:
 *         type: string
 *         format: date-time
 *       end:
 *         type: string
 *         format: date-time
 *       project_id:
 *         type: number
 *       user_id:
 *         type: number
 */

/**
 * @swagger
 *
 * /api/extra/:
 *   get:
 *     summary: GET filtered and sorted list of articles
 *     parameters:
 *       - in: query
 *         name: order
 *         description: sort direction
 *         schema:
 *           type: string
 *         example: asc
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         example: date
 *         description: sort field
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: pagination offset
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *         description: pagination limit
 *     tags:
 *       - extraHours
 *     responses:
 *       200:
 *         description: filtered and sorted list
 *       500:
 *         description: err message. probably invalid request data
 */

const getExtraHours = async (req, res) => {
  try {
    const {
      orderBy = 'date', order = 'asc', offset, limit,
    } = req.query;

    const userInclude = {
      model: db.user,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      where: {
        status: 'active',
      },
    };

    let sort = [];

    switch (orderBy) {
      case 'title':
        sort = [db.project, orderBy, order];
        break;

      case 'author':
        sort = [db.user, 'lastName', order];
        break;

      default:
        sort = [orderBy, order];
        break;
    }

    if (req.user.role !== 'admin') {
      userInclude.where = {
        id: req.user.id,
      };
    }

    const rows = await db.extraHours.findAndCountAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [userInclude],
      order: [sort],
      offset,
      limit,
    });
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

/**
 * @swagger
 *
 * /api/extra/:
 *   post:
 *     summary: create new extra hours record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/ExtraHoursModel'
 *     tags:
 *       - extraHours
 *     responses:
 *       201:
 *         description: Extra hour record created
 *       400:
 *         description: validation error
 *       500:
 *         description: err message. probably invalid request data
 */

const postExtraHours = async (req, res) => {
  try {
    const error = isValidationError(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    const { description, user_id, date } = req.body;

    const user = await db.user.findByPk(user_id);

    const extra = await db.extraHours.create(req.body);

    await notifyAboutNewRequestOrExtra({
      type: 'extraHours',
      users: [user],
      dateFormatted: moment(date).format('DD-MM-YYYY'),
      description,
    });
    return res.status(201).json(extra);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * @swagger
 *
 * /api/extra/{id}:
 *   put:
 *     summary: update extra hours record
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/ExtraHoursModel'
 *     tags:
 *      - extraHours
 *     responses:
 *       200:
 *         description: article
 *       400:
 *         description: validation error
 *       500:
 *         description: err message. probably invalid request data
 */

const putExtraHours = async (req, res) => {
  try {
    const error = isValidationError(req.body);
    if (error) {
      return res.status(400).send(error);
    }

    let extraToUpdate = await db.extraHours.findById(req.params.id);
    if (!extraToUpdate) return res.status(400).send('Error! Record not found!');

    const user = await db.user.findById(extraToUpdate.user_id);

    const message = `Ваша отметка о переработке от ${moment(extraToUpdate.date).format(
      'DD-MM-YYYY'
    )} была изменена!`;

    await extraToUpdate.update(req.body);

    const data = {
      channel: user.slack_conversational_id,
      text: message,
    };

    await rtm.sendToChat(data);

    extraToUpdate = extraToUpdate.toJSON();

    return res.json(extraToUpdate);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

/**
 * @swagger
 *
 * /api/extra/{id}:
 *   delete:
 *     summary: Delete extra hours record
 *     parameters:
 *       - in:  path
 *         name: id
 *         description: extra hours db PK
 *         required: true
 *         schema:
 *           type: number
 *     tags:
 *      - extraHours
 *     responses:
 *       200:
 *         description: extraHours
 *       500:
 *         description: err message. probably invalid request data
 */

const deleteExtraHours = async (req, res) => {
  try {
    const { id } = req.params;

    const extraToDelete = await db.extraHours.findOne({
      where: {
        id,
      },
    });

    if (!extraToDelete) {
      return res.status(404).send('Record not found!');
    }

    const user = await db.user.findByPk(extraToDelete.user_id);
    const message = `Ваша отметка о переработке от ${moment(extraToDelete.date).format(
      'DD-MM-YYYY'
    )} была удалена!`;

    await extraToDelete.destroy();

    const data = {
      channel: user.slack_conversational_id,
      text: message,
    };

    await rtm.sendToChat(data);

    return res.send('Deleted successfully!');
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const isValidationError = (data = {}) => {
  let error = '';

  if (!data.user_id) {
    error = 'Необходим идентификатор автора';
  } else if (!data.date) {
    error = 'Выберите дату';
  } else if (!data.start) {
    error = 'Выберите время начала';
  } else if (!data.end) {
    error = 'Выберите время окончания';
  } else if (new Date(data.start) > new Date(data.end)) {
    error = 'Время начала не может быть больше времени конца';
  } else if (!data.description) {
    error = 'Заполните поле "Описание"';
  }

  return error;
};

module.exports = {
  getExtraHours,
  postExtraHours,
  putExtraHours,
  deleteExtraHours,
};
