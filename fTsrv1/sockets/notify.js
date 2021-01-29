const _sortBy = require('lodash/sortBy');
const _isEqual = require('lodash/isEqual');
const _difference = require('lodash/difference');
const _union = require('lodash/union');
const _indexOf = require('lodash/indexOf');
const moment = require('moment');
const webpush = require('web-push');

moment.locale('ru');
const { rtm } = require('../slackBot/index');

const db = require('../models/index');
const controller = require('../sockets_controllers/notifications');
const config = require('../config/index');

const env = process.env.NODE_ENV || 'development';

webpush.setVapidDetails(
  `mailto:${config.vapidMail}`,
  config.vapidPublicKey,
  config.vapidPrivateKey
);

const changeData = {
  title: 'Изменен заголовок таска',
  description: 'Изменено описание таска',
  comment: 'Изменен комментарий таска',
  budget: 'Изменен бюджет таска',
  lid_company: 'Изменено название компании',
  project_folder_path: 'Изменена ссылка на папку проекта',
  job_link: 'Изменена ссылка Job проекта',
  proposal_link: 'Изменена ссылка Proposal проекта',
  lid_contact_name: 'Изменено контактное лицо',
  lid_email: 'Изменен Email',
  lid_skype: 'Изменен Skype',
  lid_phone: 'Изменен номер телефона',
  lid_location: 'Изменена локация',
  lid_time_zone: 'Изменена таймзона',
};

/**
 * Send Web PUSH notification to user (user need has subscription in db)
 * @param {*} message : string - text message
 * @param {*} directNotify  : number[] - array of id of target users
 * @param {*} userAuthor  : db.user - user object of author
 * @param {*} idTask : number - optionality for crm
 */
async function checkNotificationsInMessage(message, directNotify, userAuthor, idTask = 0) {
  if (env === 'development') {
    return;
  }

  if (!directNotify.length) {
    return;
  }

  try {
    const users = await getNotificationUser(directNotify);

    const notification = {
      notification: {
        title: 'Fusion CRM message',
        body: `Сообщение  от ${userAuthor.firstName} ${userAuthor.lastName}:\n${message}`,
        icon: userAuthor.avatarThumbnail ? userAuthor.avatarThumbnail : userAuthor.avatar,
        lang: 'ru',
        data: {
          dateOfArrival: Date.now(),
          taskId: idTask,
        },
      },
    };

    for (const user of users) {
      if (user) {
        for (const subscription of user.subscription_notifications) {
          await pushMessage(subscription.subscription, notification);
        }

        await slackCRMTaskNotify(user, userAuthor, message, idTask);
      }
    }
  } catch (err) {
    console.error(`Error sending notification: ${err}`);
  }
}

async function pushMessage(subscription, notification) {
  const options = {
    TTL: 1 * 60 * 60 * 24 * 3,
  };

  try {
    await webpush.sendNotification(subscription, JSON.stringify(notification), options);
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404 || err.statusCode === 400) {
      controller.removeUserNotificationsPushSubscriber(subscription);
    } else {
      console.error(`Subscription error: ${err}`);
    }
  }
}

async function getNotificationUser(usersArray) {
  const objUsersArray = [];

  if (!Array.isArray(usersArray) || !usersArray.length) {
    return [];
  }

  for (const userId of usersArray) {
    const options = {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: db.subscription_notification,
        },
      ],
    };

    try {
      const user = await db.user.findById(userId, options);

      if (user) {
        objUsersArray.push(user);
      }
    } catch (error) {
      console.error('getNotificationUser', error.message);
    }
  }

  return objUsersArray;
}

/**
 * Check updated task for user notification
 * @param {*} task : Task - current db.task object
 * @param {*} update  : Task - update db.task object
 */
async function checkUpdateTaskNotify(task, update) {
  if (env === 'development') {
    return;
  }

  if (!update.subscription) {
    return;
  }

  if (!_isEqual(_sortBy(task.subscription), _sortBy(update.subscription))) {
    const deletedUsers = _difference(task.subscription, update.subscription);
    const addedUsers = _difference(update.subscription, task.subscription);

    try {
      const users = await getNotificationUser(_union(deletedUsers, addedUsers));
      const addUserMessage = 'Вы были подписаны на этот таск';
      const removeUserMessage = 'Вы были отписаны от этого таска';

      for (const user of users) {
        if (user) {
          if (~_indexOf(addedUsers, user.id)) {
            await slackCRMTaskNotify(user, null, addUserMessage, task.id);
          } else if (~_indexOf(deletedUsers, user.id)) {
            await slackCRMTaskNotify(user, null, removeUserMessage, task.id);
          }
        }
      }
    } catch (error) {
      console.error('checkUpdateTaskNotify', error.message);
    }
  }
}

/**
 * Send notifications about new message for subscribed users and crm channel
 * @param {*} message  : Message - db.message object
 * @param {*} idAuthor  : id of author of message
 */
async function sendNotificationForSubscribedAndChannel(message, idAuthor) {
  if (env === 'development') {
    return;
  }

  try {
    const task = await message.getCrm_task();
    const author = await message.getAuthor();

    try {
      const slackMessage = `:rocket: *<${config.crmAddress}/${task.id}|Fusion CRM message in task:>   \`${task.title}\`*\n_${author.firstName} ${author.lastName} оставил сообщение:_\n${message.message}`;

      const data = {
        channel: task.proposal ? config.CRMApplyChannelId : config.CRMChannelId,
        text: slackMessage,
      };

      await rtm.sendToChat(data);
    } catch (error) {
      console.error('sendNotificationForSubscribedAndChannel', error.message);
    }

    const users = await getNotificationUser(task.subscription);
    const textMessage = `_Новое сообщение в таске, на который вы подписаны:_\n${message.message}`;

    for (const user of users) {
      if (user && user.id !== idAuthor) {
        await slackCRMTaskNotify(user, author, textMessage, task.id);
      }
    }
  } catch (error) {
    console.error('sendNotificationForSubscribedAndChannel', error.message);
  }
}

/**
 * Send slack notification to user (user need has slack_conversational_crm_id in db)
 * @param {*} user : db.user - user object of target
 * @param {*} userAuthor  : db.user - user object of author, may be undefined
 * @param {*} message : string - text message
 * @param {*} idTask : number - db.crm_tasks object of task, may be undefined
 */
async function slackCRMTaskNotify(user, userAuthor, message, idTask) {
  if (env !== 'development') {
    if (!(user || user.slack_conversational_crm_id || message)) {
      return;
    }

    let taskName = '';
    let taskId = '';

    try {
      const task = await db.crm_tasks.findById(idTask);

      if (task) {
        taskName = task.title;
        taskId = task.id;
      }
    } catch (error) {
      console.error('slackCRMTaskNotify', error.message);
    }

    const authorName = userAuthor
      ? `_Сообщение  от ${userAuthor.firstName} ${userAuthor.lastName}_:\n`
      : '';

    const textMessage = `:rocket: *<${config.crmAddress}/${taskId}|Fusion CRM message in task:>   \`${taskName}\`*\n${authorName}${message}`;

    try {
      const data = {
        channel: user.slack_conversational_id,
        text: textMessage,
      };

      await rtm.sendToChat(data);
    } catch (error) {
      console.error('slackCRMTaskNotify', error.message);
    }
  }
}

/**
 * Logging and notify crm user actions
 * @param {*} task : current task
 * @param {*} update : update task
 * @param {*} authorId : id of author
 */
async function crmLogging(task, update, authorId) {
  let author;
  let history;
  let slackMessage = '';

  try {
    author = await db.user.findById(authorId);
  } catch (error) {
    console.error(`No found author of crm action ${error}`);
    author = {
      firstName: 'unknown',
      lastName: 'unknown',
    };
  }

  try {
    if (update) {
      const resultDifference = await getDifferenceString(task, update);

      history = {
        event: `${author.firstName} ${author.lastName} обновил таск\n${resultDifference.returnString}`,
        history_in_task: task.id,
        moved_to_stage: resultDifference.moved_to_stage,
      };

      slackMessage = `_${author.firstName} ${author.lastName} обновил таск_\n${resultDifference.returnString}`;
    } else {
      if (task.proposal) {
        history = {
          event: `${author.firstName} ${author.lastName} создал аплай`,
          history_in_task: task.id,
          moved_to_stage: -2, // apply columns has`t id, set -2 for difference
        };
      } else {
        history = {
          event: `${author.firstName} ${author.lastName} создал лид`,
          history_in_task: task.id,
          moved_to_stage: task.task_in_column,
        };
      }

      slackMessage = `_${author.firstName} ${author.lastName} создал таск_`;
    }

    await db.crm_history.create(history);

    if (env !== 'development') {
      const message = `:rocket: *<${config.crmAddress}/${task.id}|Fusion CRM message in task:>   \`${task.title}\`*\n${slackMessage}`;
      const data = {
        channel: task.proposal ? config.CRMApplyChannelId : config.CRMChannelId,
        text: message,
      };

      await rtm.sendToChat(data);
    }
  } catch (error) {
    console.error(`Error in crmLogging ${error}`);
  }
}

/**
 * Get text of task changes for history loggin
 * @param {db.crm_tasks} oldTask - old value of task
 * @param {db.crm_tasks} newTask - new value of task
 */
async function getDifferenceString(oldTask, newTask) {
  const result = {
    returnString: '',
    moved_to_stage: undefined,
  };

  if (oldTask.task_in_column !== newTask.task_in_column) {
    result.moved_to_stage = newTask.task_in_column;

    try {
      const oldColumn = await db.crm_columns.findById(oldTask.task_in_column);
      const newColumn = await db.crm_columns.findById(newTask.task_in_column);
      if (oldColumn && newColumn) {
        result.returnString = `${result.returnString}Таск перемещен из "${oldColumn.title}" в "${newColumn.title}"`;
      }
    } catch (error) {
      console.error('getDifferenceString', error.message);
    }
  }

  // check if only moving task between columns
  if (!newTask.subscription) {
    return result;
  }

  if (!_isEqual(_sortBy(oldTask.subscription), _sortBy(newTask.subscription))) {
    const addUsersName = [];
    const deletedUsersName = [];

    const deletedUsers = _difference(oldTask.subscription, newTask.subscription);
    const addedUsers = _difference(newTask.subscription, oldTask.subscription);

    try {
      const users = await getNotificationUser(_union(deletedUsers, addedUsers));

      for (const user of users) {
        if (user) {
          if (~_indexOf(addedUsers, user.id)) {
            addUsersName.push(`${user.firstName} ${user.lastName}`);
          } else if (~_indexOf(deletedUsers, user.id)) {
            deletedUsersName.push(`${user.firstName} ${user.lastName}`);
          }
        }
      }
    } catch (error) {
      console.error('getDifferenceString', error.message);
    }

    if (addUsersName.length) {
      result.returnString = `${result.returnString}На таск подписаны: ${addUsersName.join(', ')}\n`;
    }
    if (deletedUsersName.length) {
      result.returnString = `${result.returnString}От таска отписаны: ${deletedUsersName.join(
        ', '
      )}\n`;
    }
  }

  if (newTask.archive !== oldTask.archive) {
    if (newTask.archive) {
      result.returnString = `${result.returnString}Таск перемещен в архив\n`;
      result.moved_to_stage = -1; // archive has`t id, set -1 for difference

      if (newTask.reject_reason_id) {
        try {
          const reason = await db.crm_reject_reasons.findById(newTask.reject_reason_id);
          result.returnString += `Причина отказа: ${reason.reason}\n`;

          if (newTask.reject_reason_comment) {
            result.returnString += `Комментарий: ${newTask.reject_reason_comment}\n`;
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    } else {
      result.returnString = `${result.returnString}Таск перемещен из архива\n`;
      result.moved_to_stage = newTask.task_in_column || oldTask.task_in_column;
    }
  }

  if (newTask.proposal !== oldTask.proposal) {
    result.moved_to_stage = newTask.task_in_column;
    result.returnString = `${result.returnString}Аплай переведен в лид\n`;
  }

  if (newTask.contract !== oldTask.contract) {
    result.moved_to_stage = newTask.task_in_column;
    result.returnString = `${result.returnString}Лид переведен в контракты\n`;
  }

  for (const key in changeData) {
    if (newTask[key] !== oldTask[key]) {
      result.returnString = `${result.returnString}${changeData[key]}\n`;
    }
  }

  return result;
}

module.exports = {
  checkNotificationsInMessage,
  sendNotificationForSubscribedAndChannel,
  checkUpdateTaskNotify,
  crmLogging,
};
