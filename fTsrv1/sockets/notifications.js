const db = require('../models/index');


function checkNotificationsInMessage(message, directNotify, idTask) {
  if (!directNotify.length) {
    return;
  }

  const getNotificationUser = new Promise((resolve, reject) => {
    const promiseDBRequest = [];

    for (const userId of directNotify) {
      const options = {
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      };
      promiseDBRequest.push(db.user.findById(userId, options));
    }

    Promise.all(promiseDBRequest)
      .then((users) => {
        if (!users || !users.length) {
          console.error('No users found in database');
          reject();
        }

        resolve(users);
      });
  });

  getNotificationUser.then((users) => {
    console.log(`Send message id=${message.id} task=${idTask} to next users:`);
    for (const user of users) {
      console.log(`${user.login} ${user.firstName} ${user.lastName}`);
    }
  });
}

module.exports = {
  checkNotificationsInMessage,
};
