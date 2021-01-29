const moment = require('moment');
const Sequelize = require('sequelize');

const db = require('../models/index');

const { Op } = Sequelize;

/**
 *  Splitting array of dayOff requests dates to new items in Requests table.
 */

const splitRequestsDayOffToSeparateRecords = async () => {
  try {
    const requests = await db.request.findAll({
      where: { type: 'dayOff', dates: { [Op.ne]: null } },
      include: [{
        model: db.user,
        attributes: ['id'],
      }],
    });

    for (const request of requests) {
      if (request.dates) {
        const requestData = request.toJSON();

        for (const date of request.dates) {
          requestData.dateFrom = moment(date)
            .startOf('day')
            .format();
          requestData.dateTo = moment(date)
            .endOf('day')
            .format();
          requestData.rest_days_number = 0; // Set to 1 later

          delete requestData.dates;
          delete requestData.id;

          const newRequest = await db.request.create(requestData);
          if (requestData.users[0] && requestData.users[0].id) {
            await newRequest.setUsers(requestData.users[0].id);
          }

          console.log(`---- newRequest.id
---- ${newRequest.id}
----`);
        }

        const destroyedRequest = await db.request.destroy({ where: { id: request.id } });

        console.log(`---- destroyedRequest for ID ${request.id}
---- ${destroyedRequest === 1}
----`);
      }
    }
  } catch (err) {
    console.log('Error description: ', err);
  }
};

splitRequestsDayOffToSeparateRecords();
