const db = require('../models/index');
const {
  checkNotificationsInMessage,
  sendNotificationForSubscribedAndChannel,
} = require('../sockets/notify');
const PossibleContinueError = require('../utils/customError');

const getMessagesByTask = async (task) => {
  try {
    const options = {
      where: {
        crm_tasks_id: task,
      },
      attributes: { exclude: ['updatedAt'] },
      order: [['createdAt', 'ASC']],
    };

    const messages = await db.message.findAll(options);

    if (!messages) {
      throw new Error(`no messages found in db for task ${task}`);
    }
    return messages;
  } catch (error) {
    console.error(`Error in getMessagesByTask method: ${error}`);
  }
};

const getReadStatusesByTask = async (task) => {
  try {
    const options = {
      attributes: { exclude: ['updatedAt'] },
      include: [
        {
          model: db.message,
          attributes: ['crm_tasks_id'],
          where: {
            crm_tasks_id: task,
          },
        },
      ],
      order: [['createdAt', 'ASC']],
    };

    const messageUser = await db.messages_user.findAll(options);

    if (!messageUser) {
      throw new Error(`no messages found in db for task ${task}`);
    }

    return messageUser;
  } catch (error) {
    console.error(`Error in getReadStatusesByTask method: ${error}`);
  }
};

const putNewMessage = async ({
  idTask,
  idAuthor,
  files,
  message,
  directNotify,
}) => {
  try {
    const messageData = {
      message,
      author_id: idAuthor,
      crm_tasks_id: idTask,
      files,
    };

    const newMessage = await db.message.create(messageData);
    if (!newMessage) {
      throw new Error('no message created');
    }

    const user = await db.user.findById(idAuthor);
    if (!user) {
      throw new PossibleContinueError(
        newMessage,
        `error find user for association author_id ${idAuthor}`
      );
    }

    if (directNotify.length > 0) {
      checkNotificationsInMessage(
        newMessage.message,
        directNotify,
        user,
        idTask
      );
    }

    const associations = await newMessage.addSubscriber(user, {
      through: {
        readed_date: Date.now(),
      },
    });
    if (!associations) {
      throw new PossibleContinueError(
        newMessage,
        `error create associations to user_id ${idAuthor}`
      );
    }

    sendNotificationForSubscribedAndChannel(newMessage, idAuthor);

    return {
      message: newMessage,
      association: associations[0],
    };
  } catch (error) {
    if (error instanceof PossibleContinueError) {
      console.log(error.message);
      return {
        message: error.response,
      };
    }
    console.error(`Error in putNewMessage method: ${error}`);
  }
};

const putReadedStatus = async ({ idMessage, idUser, date }) => {
  try {
    const options = {
      attributes: { exclude: ['updatedAt'] },
      include: [
        {
          model: db.user,
          as: 'subscribers',
          attributes: ['id'],
          where: {
            id: idUser,
          },
        },
      ],
    };

    let message = await db.message.findById(idMessage, options);
    if (!message) {
      delete options.include[0].where;

      message = await db.message.findById(idMessage, options);

      if (!message) {
        throw new Error(`no message found by id ${idMessage}`);
      }

      const user = await db.user.findById(idUser);

      if (!user) {
        throw new Error(`error find user user_id ${idUser}`);
      }

      const association = await message.addSubscribers(user, {
        through: {
          readed_date: date,
        },
      });

      if (!association) {
        throw new Error(`error create association to user_id ${idUser}`);
      }

      return {
        task: message.crm_tasks_id,
        result: association[0],
      };
    }
    const association = await message.subscribers[0].messages_user.update({
      readed_date: date,
    });

    if (!association) {
      throw new Error(
        `error update association to user_id ${idUser} in message id=${idMessage}`
      );
    }

    return {
      task: message.crm_tasks_id,
      result: [association],
    };
  } catch (error) {
    console.error(`Error in putReadedStatus method: ${error}`);
  }
};

const getCountUnreadMessages = async (task, user) => {
  try {
    let options = {
      where: {
        crm_tasks_id: task,
      },
    };
    const messageTotal = await db.message.count(options);

    options = {
      ...options,
      attributes: { exclude: ['updatedAt'] },
      include: [
        {
          model: db.messages_user,
          as: 'message_user_info',
          attributes: ['id', 'user_id', 'readed_date'],
          where: {
            user_id: user,
            readed_date: { [db.Sequelize.Op.ne]: null },
          },
        },
      ],
    };
    const message = await db.message.findAll(options);

    return {
      task,
      unreadCount: messageTotal - message.length,
      messageTotal,
    };
  } catch (error) {
    console.error(`Error in getCountUnreadMessages method: ${error}`);
  }
};

module.exports = {
  getMessagesByTask,
  putNewMessage,
  getCountUnreadMessages,
  getReadStatusesByTask,
  putReadedStatus,
};
