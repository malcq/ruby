const moment = require('moment');
const db = require('../models/index');
const { calendarGenerator } = require('../utils/calendar/calendarGenerator');

/**
 * @swagger
* definitions:
 *   PlanModel:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       noteForAdmin:
 *         type: string
 *       idChain:
 *         type: number
 */

/**
 * @swagger
 *
 * /api/plan/{id}:
 *   get:
 *     summary: GET particukar plan by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: plan db Pkey
 *     tags:
 *       - plans
 *     responses:
 *       200:
 *         description: plan
 *       500:
 *         description: error message
 */

const getPlan = async (req, res) => {
  try {
    const { id } = req.params;

    let plan = await db.plan.findOne({
      include: [{
        model: db.user,
        where: { id },
        attributes: ['id', 'login', 'firstName', 'lastName'],
      },
      {
        model: db.taskJob,
        required: false,
      },
      ],
    });
    plan = setChain(plan);
    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 *
 * /api/plan/:
 *   post:
 *     summary: create Plan
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/PlanModel'
 *           description: new Plan object
 *     tags:
 *       - plans
 *     responses:
 *       200:
 *         description: Plan created
 *       500:
 *         description: error message
 */

const postPlan = async (req, res) => {
  try {
    let plan = await db.plan.create();
    await plan.setUsers(req.body.id);

    plan = await db.plan.findById(plan.id, {
      include: [
        { model: db.taskJob },
        {
          model: db.user,
          attributes: ['id', 'login', 'firstName', 'lastName'],
        },
      ],
    });

    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 *
 * /api/plan/{id}:
 *   put:
 *     summary: update Plan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: plan db Pkey
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/PlanModel'
 *           description: new Plan object
 *     tags:
 *       - plans
 *     responses:
 *       200:
 *         description: Plan updated
 *       500:
 *         description: error message
 */

const putPlan = async (req, res) => {
  try {
    const newPlanPayload = req.body;
    if (newPlanPayload.editNote) {
      let plan = await db.plan.findById(req.params.id);
      plan = await plan.update(newPlanPayload.plan);
      return res.send(plan);
    }

    const { jobsToAdd, oldChain, newChain } = newPlanPayload;
    delete newPlanPayload.taskJobs;
    delete newPlanPayload.jobsToAdd;
    delete newPlanPayload.oldChain;
    delete newPlanPayload.newChain;
    newPlanPayload.idChain = newChain;

    let plan = await db.plan.findById(req.params.id, {
      include: [{ model: db.taskJob }, {
        model: db.user,
        attributes: ['id', 'login', 'firstName', 'lastName'],
      }],
    });
    for (let i = 0; i < oldChain.length; i += 1) {
      let deleteJob = true;
      for (let n = 0; n < newChain.length; n += 1) {
        if (oldChain[i] === newChain[n]) {
          deleteJob = false;
          break;
        }
      }
      if (deleteJob) {
        await db.plan_taskJob.destroy({ where: { id: oldChain[i] } });
      }
    }
    await plan.addTaskJobs(jobsToAdd);

    plan = await db.plan.findById(plan.id, { include: { model: db.taskJob } });

    plan.taskJobs.forEach((element) => {
      let pushInChain = true;
      for (let i = 0; i < newChain.length; i += 1) {
        if (element.plan_taskJob.id === newChain[i]) {
          pushInChain = false;
          break;
        }
      }
      if (pushInChain) {
        newChain.push(element.plan_taskJob.id);
      }
    });
    plan = await plan.update(newPlanPayload);
    plan = setChain(plan);
    return res.send(plan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 *
 * /api/plan/{id}:
 *   delete:
 *     summary: delete Plan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: plan db Pkey
 *     tags:
 *       - plans
 *     responses:
 *       200:
 *         description: Plan deleted
 *       500:
 *         description: error message
 */

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await db.plan.destroy({ where: { id } });
    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const calculateHolidaysAndWeekends = async (idUser, idRequest, newDataPayload) => {
  if (!newDataPayload.finishTask) {
    return newDataPayload;
  }
  const oldplanItem = await db.plan_taskJob.findById(idRequest);
  const startTaskDate = moment(oldplanItem.startTask);
  const finishTaskDate = moment(newDataPayload.finishTask);
  const holidaysRequests = await db.request.findAll({
    include: [{
      model: db.user,
      where: { id: idUser },
      attributes: [],
    }],
    where: {
      type: {
        [db.Sequelize.Op.ne]: 'technical',
      },

      dateFrom: {
        [db.Sequelize.Op.or]:
          [null,
            { [db.Sequelize.Op.lte]: finishTaskDate },
          ],

      },
      dateTo: {
        [db.Sequelize.Op.or]:
          [null,
            { [db.Sequelize.Op.gte]: startTaskDate },
          ],
      },
      status: 'completed',
    },
  });
  let userHolidayCount = 0;
  // calculate holidays
  await holidaysRequests.forEach(async (day) => {
    // array of days off
    if (day.dates) {
      await day.dates.forEach((date) => {
        date = moment(date, 'YYYY-MM-DD');
        if (date.isSameOrBefore(finishTaskDate, 'day') && startTaskDate.isSameOrBefore(date, 'day')) {
          const dayPositionInYear = date.diff(calendarGenerator.calendar.dates[moment(day.dateFrom).format('YYYY')][0], 'days');
          const dayOffDay = calendarGenerator.calendar.dates[moment(day.dateFrom).format('YYYY')][dayPositionInYear];
          if (!dayOffDay.is_holiday) {
            userHolidayCount += 1;
          }
        }
      });
    } else {
      // range date (two dates)
      const startDate = moment(day.dateFrom, 'YYYY-MM-DD');
      let endDate = moment(day.dateTo, 'YYYY-MM-DD');
      if (endDate.isAfter(finishTaskDate)) {
        endDate = finishTaskDate;
      }
      const dayFromPositionInYear = startDate.diff(moment(calendarGenerator.calendar.dates[moment(day.dateFrom).format('YYYY')][0].day, 'DD-MM-YYYY'), 'days');
      const dayToPositionInYear = endDate.diff(startDate, 'days');
      const datesRange = calendarGenerator.calendar.dates[moment(day.dateFrom).format('YYYY')].slice(
        dayFromPositionInYear, dayToPositionInYear + dayFromPositionInYear + 1
      );
      const pureHolidays = datesRange.reduce(
        calendarGenerator.calendar.workdaysCounter, 0
      );// holidays without weekends
      userHolidayCount += pureHolidays;
    }
  });
  // calculate weekends
  const diffStart = startTaskDate.diff(moment(calendarGenerator.calendar.dates[moment(startTaskDate).format('YYYY')][0].day, 'DD-MM-YYYY'), 'days');
  const diffEnd = (finishTaskDate.diff(startTaskDate, 'days') + 1);
  const days = calendarGenerator.calendar.dates[moment(startTaskDate).format('YYYY')].slice(diffStart, diffEnd + diffStart);
  const workdays = days.reduce(calendarGenerator.calendar.workdaysCounter, 0);
  const weekendDays = diffEnd - workdays;
  // sum weekend and holidays
  const offsetEnd = weekendDays + userHolidayCount;
  const newfinishTask = moment(newDataPayload.finishTask, 'YYYY-MM-DD');
  newfinishTask.subtract(offsetEnd, 'days');
  return { finishTask: newfinishTask };
};

/**
 * @swagger
 *
 * /api/plan/taskJobInPlan/{id}:
 *   put:
 *     summary: update Plan
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: plan db Pkey
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/PlanModel'
 *           description: new Plan object
 *     tags:
 *       - plans
 *     responses:
 *       200:
 *         description: Plan updated
 *       500:
 *         description: error message
 */

const putTaskJobInPlan = async (req, res) => {
  try {
    let newDataPayload = req.body;
    newDataPayload = await calculateHolidaysAndWeekends(req.user.id, req.params.id, newDataPayload);
    let planItem = await db.plan_taskJob.update(newDataPayload, {
      where: { id: req.params.id },
    });
    planItem = await db.plan_taskJob.findById(req.params.id);
    return res.json(planItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const setChain = (plan) => {
  if (!plan || !plan.taskJobs.length) { return plan; }
  try {
    const chainArray = [];
    for (let i = 0; i < plan.idChain.length; i += 1) {
      for (let n = 0; n < plan.taskJobs.length; n += 1) {
        if (plan.idChain[i] === plan.taskJobs[n].plan_taskJob.id) {
          chainArray.push(plan.taskJobs[n]);
          break;
        }
      }
    }
    const newPlan = {
      ...plan.get(),
      taskJobs: chainArray,
    };
    return newPlan;
  } catch (error) {
    return plan;
  }
};

module.exports = {
  postPlan,
  putPlan,
  getPlan,
  deletePlan,
  putTaskJobInPlan,
};
