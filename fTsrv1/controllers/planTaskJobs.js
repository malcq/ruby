const groupBy = require('lodash/groupBy');
const db = require('../models/index');

const { Op } = db.Sequelize;
const getPlanTaskJobsTimeFrames = async (req, res) => {
  try {
    const { taskJobIds, planId } = req.query;
    const planTaskJobs = await db.plan_taskJob.findAll({
      attributes: ['startTask', 'finishTask', 'taskJob_id', 'plan_id'],
      where: {
        taskJob_id: taskJobIds,
        plan_id: { [Op.ne]: planId },
        finishTask: { [Op.ne]: null },
        startTask: { [Op.ne]: null },
      },
    });
    const groupedTaskJobs = groupBy(planTaskJobs, 'taskJob_id');
    return res.json(groupedTaskJobs);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getPlanTaskJobsTimeFrames,
};
