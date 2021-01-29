const db = require('../models/index');
const { checkUpdateTaskNotify, crmLogging } = require('../sockets/notify');

const TaskSelector = {
  task: {
    archive: false,
    proposal: false,
    contract: false,
  },
  taskArchive: {
    archive: true,
    proposal: false,
    contract: false,
  },
  proposalTask: {
    archive: false,
    proposal: true,
    contract: false,
  },
  proposalTaskArchive: {
    archive: true,
    proposal: true,
    contract: false,
  },
  contractTask: {
    archive: false,
    proposal: false,
    contract: true,
  },
  contractTaskArchive: {
    archive: true,
    proposal: false,
    contract: true,
  },
};

const getTasks = async (taskSelector = TaskSelector.task) => {
  try {
    const options = {
      where: { ...taskSelector },
    };

    if (taskSelector.archive || taskSelector.contract) {
      options.order = [['updatedAt', 'DESC']];
    }

    const tasks = await db.crm_tasks.findAll(options);

    if (!tasks) {
      throw new Error('no tasks found in db');
    }

    return tasks;
  } catch (error) {
    console.error(`Error in getTasks method: ${error}`);
  }
};

const getTaskHistory = async (taskId) => {
  try {
    const options = {
      where: {
        history_in_task: taskId,
      },
      order: [['createdAt', 'ASC']],
    };

    const history = await db.crm_history.findAll(options);

    if (!history) {
      throw new Error('no history found in db');
    }

    return history;
  } catch (error) {
    console.error(`Error in getTaskHistory method: ${error}`);
  }
};

const getDeveloperTasks = async (id, archive = false) => {
  try {
    const sqlQuery = `select * from crm_tasks where ${id} = any(SUBSCRIPTION) AND archive = ${archive} ORDER BY "updatedAt" DESC`;

    const tasks = await db.sequelize.query(sqlQuery, {
      model: db.crm_tasks,
      mapToModel: true,
    });

    if (!tasks) {
      throw new Error('no tasks found in db');
    }

    return tasks;
  } catch (error) {
    console.error(`Error in getDeveloperTasks method: ${error}`);
  }
};

const updateTask = async (data, authorId) => {
  const { id_task, update } = data;

  if (update.id) {
    delete update.id;
  }

  try {
    const task = await db.crm_tasks.findById(id_task);
    const oldTaskValues = { ...task.dataValues };
    if (!task) {
      throw new Error(`no task found by id: ${id_task}`);
    }

    checkUpdateTaskNotify(task, update);
    crmLogging(
      { ...task.dataValues, subscription: [...task.dataValues.subscription] },
      update,
      authorId
    );

    await task.update(update);
    return oldTaskValues;
  } catch (error) {
    console.error(`Error in updateTask method: ${error}`);
  }
};

const deleteTask = async (id_task) => {
  try {
    const task = await db.crm_tasks.destroy({ where: { id: id_task } });

    if (!task) {
      throw new Error(`no task deleted by id: ${id_task}`);
    }
  } catch (error) {
    console.error(`Error in deleteTask method: ${error}`);
  }
};

const createTask = async (data, authorId) => {
  try {
    const task = await db.crm_tasks.create(data);

    if (!task) {
      throw new Error('no task created');
    }
    crmLogging(task, undefined, authorId);
  } catch (error) {
    console.error(`Error in createTask method: ${error}`);
  }
};

const getTasksForAnalytics = async () => {
  try {
    const options = {
      include: [
        {
          model: db.crm_history,
          attributes: {
            exclude: ['event', 'updatedAt'],
          },
        },
      ],
      order: [[db.crm_history, 'createdAt', 'ASC']],
    };

    const tasks = await db.crm_tasks.findAll(options);

    if (!tasks) {
      throw new Error('no tasks found in db');
    }

    return tasks;
  } catch (error) {
    console.error(`Error in getTasksForAnalytics method: ${error}`);
  }
};

module.exports = {
  TaskSelector,
  getTasks,
  getDeveloperTasks,
  updateTask,
  createTask,
  getTaskHistory,
  getTasksForAnalytics,
  deleteTask,
};
