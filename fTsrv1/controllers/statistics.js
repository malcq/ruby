const moment = require('moment');
const groupBy = require('lodash/groupBy');
const countBy = require('lodash/countBy');
const db = require('../models');

const { createRequestFilter, createRequestDateRangesFilter } = require('../utils');

/**
 * @swagger
 * definitions:
 *   createArticleModel:
 *     type: object
 *     required:
 *       - link
 *     properties:
 *       link:
 *         type: string
 *       tags:
 *         type: array
 *         collectionFormat: multi
 *         items:
 *           type: object
 *           properties:
 *             value:
 *               type: string
 *             label:
 *               type: string
 *             __isNew__:
 *               type: boolean
 *
 *   dates:
 *     type: object
 *     example: {from: 2019-08-14 18:58:57.188+03, to: 2019-08-14 18:58:57.188+03}
 *     properties:
 *       from:
 *         type: string
 *         format: date-time
 *       to:
 *         type: number
 *         format: date-time
 */

/**
 * @swagger
 *
 * /api/statistics/{id}:
 *   get:
 *     summary: GET all stats for user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: dates
 *         schema:
 *           $ref: '#/definitions/dates'
 *         description: filter for where by date
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         description: id of user
 *     tags:
 *       - statistics
 *     responses:
 *       200:
 *         description: statistics for user
 */

const getStatisticsForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const where = createRequestFilter(req.query);
    let requestFilter = {};
    let extraFilter = {};
    if (req.query.dates) {
      const dates = JSON.parse(req.query.dates);
      const from = moment(dates.from).toISOString();
      const to = moment(dates.to).toISOString();
      if (!from || !to) {
        requestFilter = {};
      } else {
        requestFilter = createRequestDateRangesFilter(from, to);
        extraFilter = { createdAt: { $between: [from, to] } };
      }
    }
    const statistics = await db.request.findAll({
      where: { ...requestFilter, ...where },
      include: [
        {
          model: db.user,
          where: { id },
          attributes: [],
        },
      ],
    });

    const extraHoursRecords = await db.extraHours.findAll({
      where: extraFilter,
      include: [
        {
          model: db.user,
          where: { id },
          attributes: [],
        },
      ],
    });

    let extraHours = 0;

    extraHoursRecords.forEach((currentValue) => {
      if (currentValue.start && currentValue.end) {
        const start = moment(currentValue.start);
        const end = moment(currentValue.end);

        const recordDifference = end.diff(start, 'minutes');

        extraHours += Math.round(recordDifference / 60);
      }
    });

    const allRequests = statistics.length;
    const statisticsType = countBy(statistics, request => request.type);
    const statisticsStatus = countBy(statistics, request => request.status);
    const groupStatistics = groupBy(statistics, request => request.type);
    return res.json({
      statisticsType,
      statisticsStatus,
      allRequests,
      groupStatistics,
      extraHours,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 *
 * /api/statistics/holiday/{id}:
 *   get:
 *     summary: GET User's holiday statistic
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id of user
 *         schema:
 *           type: number
 *     tags:
 *       - statistics
 *     responses:
 *       200:
 *         description: statistics for user
 *       500:
 *         description: err message. probably invalid request data
 */

const getStatisticForUserHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    // const where = createRequestFilter(req.query);
    // where.type = 'vacation';
    // TO DO: Add statistic for one working year

    // const today = moment();
    // const userTime = await db.user.findById(userId, {
    //   attributes: ['createdAt'],
    // });
    // const diffYear = today.diff(userTime.createdAt, 'y');
    // const startYear = moment(userTime.createdAt).add(diffYear, 'y');
    // const endYear = moment(startYear).add(1, 'y');

    let holidaysStatistic = await db.request.findAll({
      where: { type: 'vacation', status: 'accept' },
      include: [
        {
          model: db.user,
          where: { id },
          attributes: [],
        },
      ],
    });
    holidaysStatistic = holidaysStatistic.reduce(
      (sum, current) => sum + current.rest_days_number,
      0
    );
    const percent = Math.round(holidaysStatistic / 0.28);
    return res.json({ percent, holidaysStatistic });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStatisticsForUser,
  getStatisticForUserHoliday,
};
