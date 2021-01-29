const moment = require('moment');
const db = require('./models');
const { calendarGenerator } = require('./utils/calendar/calendarGenerator');

/**
 * Update rest_days_number field for all vacations and medical requests
 */
const updateVacationAndMedicalRequests = async () => {
  try {
    await calendarGenerator.initCalendar();
    const requests = await db.request.findAll({
      where: {
        type: ['vacation', 'medical'],
      },
    });
    const updatedRequestsMap = requests.map((item) => {
      if (item.dateFrom && item.dateTo) {
        const dates = {
          dateFrom: moment(item.dateFrom).format('YYYY-MM-DD'),
          dateTo: moment(item.dateTo).format('YYYY-MM-DD'),
        };
        const workdays = calendarGenerator.calendar.getWorkdays(dates);
        return db.request.update({ rest_days_number: workdays }, { where: { id: item.id } });
      }
      return item;
    });
    await Promise.all(updatedRequestsMap);
    console.log('All records updated');
  } catch (error) {
    console.error('Update is failed:', error);
  }
};

updateVacationAndMedicalRequests();
