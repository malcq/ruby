const db = require('../models/index');

/**
 * @swagger
 *
 * definitions:
 *   eventModel:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: number
 *       title:
 *         type: string
 *       type:
 *         type: string
 *         enum: ['technical', 'vacation', 'medical', 'dayOff', 'common', 'documents']
 *       dateFrom:
 *         type: string
 *         format: date-time
 *       dateTo:
 *         type: string
 *         format: date-time
 *       dates:
 *         type: array
 *         collectionFormat: multi
 *         items:
 *            type: "string"
 *            format: date-time
 *       comment:
 *         type: string
 *       deniedComment:
 *         type: string
 *       updatedBy:
 *         type: number
 *       status:
 *         type: string
 *         enum: ['wait', 'completed', 'denied', 'inProgress']
 *
 *
 *   createEventModel:
 *     type: object
 *     required:
 *       - title
 *       - date
 *       - type
 *       - comment
 *     properties:
 *       title:
 *         type: string
 *       type:
 *         type: string
 *         enum: ['technical', 'vacation', 'medical', 'dayOff', 'common', 'documents']
 *       date:
 *         type: "string"
 *         format: date-time
 *       comment:
 *         type: string
 *       from:
 *         type: object
 */

/**
 * @swagger
 *
 * /api/event/:
 *   get:
 *     description: GET all events records
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: requests
 *
 */

const getEvents = async (req, res) => {
  try {
    const events = await db.event.findAll({
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
    });
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/event/:
 *   get:
 *     description: GET all events records
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: requests
 *
 */

const postEvent = async (req, res) => {
  try {
    const newEventPayload = req.body;
    const event = await db.event.create(newEventPayload);
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const putEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const event = await db.event.update(newData, {
      where: { id },
    });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.event.findOne({
      where: { id },
      attributes: {
        exclude:
          ['createdAt', 'updatedAt'],
      },
    });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await db.event.destroy({ where: { id } });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getEvent,
  putEvent,
  postEvent,
  deleteEvent,
  getEvents,
};
