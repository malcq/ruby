const moment = require('moment');
const db = require('../models/index');

async function fun() {
  try {
    const users = await db.user.findAll();
    users.forEach((element) => {
      if (element.DoB) {
        const DoB = moment(element.DoB).subtract(1, 'days').startOf('day').add(12, 'h');
        db.user.update({ DoB }, { where: { id: element.id } });
      }
    });
    console.log('succese');
  } catch (error) {
    console.log(error);
  }
}
fun();
