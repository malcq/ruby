const moment = require('moment');
const sequelize = require('sequelize');
const db = require('../../models/index');

const { Op } = db.Sequelize;

const EXPIRATION_TIME_IN_HOURS = 24 * 2;

exports.default = async function removeOldApplies() {
  try {
    await db.crm_tasks.destroy({
      where: [
        {
          proposal: true,
          createdAt: {
            $lte: moment().subtract(EXPIRATION_TIME_IN_HOURS, 'hours').toDate(),
          },
        },
        // include tasks with no subscribers ('subscription' Arraylength equal null)
        sequelize.where(
          sequelize.fn('array_length', sequelize.col('subscription'), 1),
          { [Op.eq]: null }
        ),
      ],
    });
  } catch (err) {
    console.error(err);
  }
};

// every day at 00:00
module.exports.cronExpression = '0 0 * * *';
