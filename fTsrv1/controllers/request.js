const db = require('../models/index');
const {
  notifyAboutNewRequestOrExtra,
  notifyUserAboutHisRequest,
} = require('../slackBot/messages');
const { createRequestFilter, createRequestDateRangesFilter } = require('../utils');

const { Op } = db.Sequelize;
const { calendarGenerator } = require('../utils/calendar/calendarGenerator');

/**
 * @swagger
 *
 * definitions:
 *   requestModel:
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
 *   createRequestModel:
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
 *         properties:
 *           id:
 *             type: number
 */

/**
 * @swagger
 *
 * /api/request/{userId}:
 *   get:
 *     summary: GET all user's request records
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: user's DB pkey
 *         required: true
 *         schema:
 *           type: number
 *     tags:
 *      - requests
 *     responses:
 *       200:
 *         description: Particular user's requests
 *       500:
 *         description: error message. Probably error in parameters
 *
 */

const getRequestsForUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const where = createRequestFilter(req.query);
    const request = await db.request.findAll({
      where,
      include: [
        {
          model: db.user,
          where: { id: userId },
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
        {
          model: db.user,
          as: 'admin_who_updated_id',
        },
      ],
      order: [['id', 'DESC']],

      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    return res.json(request);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/request/:
 *   get:
 *     summary: GET all request records
 *     parameters:
 *       - in: query
 *         name: filter
 *         allowReserved: true
 *         schema:
 *           type: string
 *           example: {"type" : "string", "status": "string"}
 *           description: filter for where STRINGIFIED object
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           collectionFormat: multi
 *           items:
 *             type: "string"
 *           description: sorting parameters
 *           example: ['id', 'ASC']
 *     tags:
 *      - requests
 *     responses:
 *       200:
 *         description: Filtered and sorted list of requests
 *       500:
 *         description: error message. Probably error in parameters
 *
 */

const getRequests = async (req, res) => {
  try {
    let filter = {};
    let dates = {};
    const { query } = req;
    query.filter = query.filter ? JSON.parse(query.filter) : {};
    filter = createRequestFilterByRole(query, req.user.role, res);
    if (query.filter.dates) {
      dates = {
        from: new Date(query.filter.dates.from),
        to: new Date(query.filter.dates.to),
      };
      filter = createFilter(dates, query);
    } else {
      filter = makeFilterRequests(query.filter);
    }
    filter = { ...filter, ...createRequestFilterByRole(query, req.user.role, res) };
    let ordering = Array.isArray(query.sort) ? query.sort : ['id', 'DESC'];
    if (ordering[0] === 'login') {
      ordering = [{ model: db.user }, 'firstName', ordering[1]];
    }

    const requests = await db.request.findAll({
      where: filter,
      include: [
        {
          model: db.user,
          where: createRequestFilterByUser(query.filter),
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
        {
          model: db.user,
          as: 'admin_who_updated_id',
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [ordering],
    });

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/request/:
 *   put:
 *     summary: Update request record
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/requestModel'
 *     tags:
 *     - requests
 *     responses:
 *       200:
 *         description: Updated request record
 *       500:
 *         description: err message. probably invalid request body
 */

const putRequest = async (req, res) => {
  try {
    const newData = req.body;
    const roleOpportunities = { include: [{ model: db.user }] };
    if (req.user.role === 'admin') {
      roleOpportunities.where = { id: req.user.id };
    }
    newData.updated_by = req.user.id;
    if (newData.type === 'vacation') {
      countRestDays(newData);
    }
    const request = await db.request.findById(newData.id, roleOpportunities);
    await request.update(newData);

    notifyUserAboutHisRequest(request);
    return res.json(request);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/request/:
 *   post:
 *     summary: Create request record
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/definitions/createRequestModel'
 *     tags:
 *      - requests
 *     responses:
 *       201:
 *         description: new request created
 *       500:
 *         description: err message. probably invalid request body

 */

const postRequest = async (req, res) => {
  try {
    const payload = req.body;

    const { id } = payload.from;
    delete payload.from;
    const { type } = payload;

    switch (type) {
      case 'technical':
      case 'common':
      case 'documents':
      case 'dayOff':
        payload.rest_days_number = 1;
        break;
      case 'timeOff':
        // explicity convert to 'dayOff' type
        payload.type = 'dayOff';
        payload.rest_days_number = 0;
        break;
      case 'medical':
      case 'vacation':
        countRestDays(payload);
        break;

      default:
        return res.status(400).json({ message: 'undefined type' });
    }
    delete payload.date;
    let request = await db.request.create(payload);
    await request.setUsers(id);
    request = await db.request.findById(request.id, {
      include: [
        {
          model: db.user,
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
      ],
    });
    await notifyAboutNewRequestOrExtra(request);
    return res.status(201).json(request);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/request/{id}:
 *   delete:
 *     summary: Delete request record
 *     parameters:
 *       - in:  path
 *         name: id
 *         description: request db PK
 *         required: true
 *         schema:
 *           type: number
 *     tags:
 *      - requests
 *     responses:
 *       200:
 *         description: request deleted
 *       500:
 *         description: Error message. Probably invalid request data
 *
 */

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.request.destroy({ where: { id } });
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createRequestFilterByUser = ({ from: login, id } = {}) => {
  let filterParams = { status: 'active' };
  if (login) {
    // todo to author
    filterParams = {
      [Op.and]: [
        {
          [Op.or]: [{ login }, { id }],
        },
        {
          status: 'active',
        },
      ],
    };
  }
  return filterParams;
};

const makeFilterRequests = ({ type, status } = {}) => {
  const accepted = ['accept', 'completed'];
  const filterParams = {};
  if (type) {
    filterParams.type = type;
  }
  if (status) {
    filterParams.status = accepted.includes(status) ? { [Op.or]: accepted } : status;
  }
  return filterParams;
};

const allowedListOfTypesFor = {
  admin: ['vacation', 'dayOff', 'medical', 'technical', 'common', 'documents'],
  sales: ['vacation', 'dayOff', 'medical'],
  manager: ['vacation', 'dayOff', 'medical'],
};

const createRequestFilterByRole = ({ payload = {} } = {}, role, res) => {
  if (payload.type && !allowedListOfTypesFor[role].includes(payload.type)) {
    return res.status(403).json({ message: `Not acceptable for ${role}` });
  }
  return { type: allowedListOfTypesFor[role] };
};

const countRestDays = (data) => {
  if (data.dateFrom && data.dateTo) {
    data.rest_days_number = calendarGenerator.calendar.getWorkdays(data);
  }
};

// TODO: rename
const createFilter = ({ from: fromDate, to } = {}, { filter: previousFilter } = {}) => {
  if (!fromDate || !to) return {};
  return {
    [Op.and]: [createRequestDateRangesFilter(fromDate, to), makeFilterRequests(previousFilter)],
  };
};

module.exports = {
  postRequest,
  putRequest,
  getRequests,
  getRequestsForUser,
  deleteRequest,
};
