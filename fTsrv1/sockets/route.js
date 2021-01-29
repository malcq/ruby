const jwt = require('jsonwebtoken');
const _get = require('lodash.get');

const controllerColumns = require('../sockets_controllers/columns');
const controllerTasks = require('../sockets_controllers/tasks');
const controllerUser = require('../controllers/users');
const controllerChat = require('../sockets_controllers/chat');
const controllerTechnology = require('../controllers/technology');
const controllerNotifications = require('../sockets_controllers/notifications');
const { getRejectReasons } = require('../sockets_controllers/rejectReasons');
const config = require('../config/index');
const socketMessage = require('./socket-constant');

const { TaskSelector } = controllerTasks;

const connectRoute = (io) => {
  io.use((socket, next) => {
    const { token } = socket.handshake.query;

    if (!token) {
      next(new Error('401 No token found in request.'));
      return;
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err || !decoded) {
        next(new Error('401 Failed to authenticate token.'));
        return;
      }

      socket.handshake.user = decoded;

      const req = {
        params: {
          login: socket.handshake.user.login,
        },
      };

      const res = {};
      res.send = (data) => {
        socket.handshake.role = data.role;
        socket.handshake.status = data.status;
        next();
      };
      await controllerUser.getUser(req, res);
    });
  });


  io.on('connection', (socket) => {
    const userLogin = _get(socket, 'handshake.user.login');

    if (!userLogin) {
      console.error('Unknown user login, connect denied');
      return;
    }

    console.log(`connect socket, login: ${userLogin}, role: ${socket.handshake.role}`);

    socket.on('disconnect', () => {
      console.log(`disconnect socket: ${userLogin}`);
    });

    if (isAdminRole()) {
      addAdminsRoute();
    }

    if (isUserRole()) {
      addUsersRoute();
    }

    addCommonRoute();

    /**
     * all service function in closure
     */
    function isAdminRole() {
      const role = _get(socket, 'handshake.role');
      const status = _get(socket, 'handshake.status');
      return (role === 'admin' || role === 'sales') && status === 'active';
    }

    function isUserRole() {
      const role = _get(socket, 'handshake.role');
      const status = _get(socket, 'handshake.status');
      return role === 'user' && status === 'active';
    }

    function addAdminsRoute() {
      socket.on(socketMessage.GET_COLUMN_EVENT,
        () => getInfoAndEmitSelector(socketMessage.GET_COLUMN_EVENT));

      socket.on(socketMessage.GET_TASKS_EVENT,
        () => getInfoAndEmitSelector(socketMessage.GET_TASKS_EVENT));

      socket.on(socketMessage.GET_ARCHIVE_TASKS_EVENT,
        () => getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_TASKS_EVENT));

      socket.on(socketMessage.GET_TASK_FOR_ANALYTICS,
        () => getInfoAndEmitSelector(socketMessage.GET_TASK_FOR_ANALYTICS));

      socket.on(socketMessage.GET_PROPOSAL_TASKS,
        () => getInfoAndEmitSelector(socketMessage.GET_PROPOSAL_TASKS));

      socket.on(socketMessage.GET_ARCHIVE_PROPOSAL_TASKS,
        () => getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_PROPOSAL_TASKS));

      socket.on(socketMessage.GET_CONTRACTS_EVENT,
        () => getInfoAndEmitSelector(socketMessage.GET_CONTRACTS_EVENT));

      socket.on(socketMessage.GET_ARCHIVE_CONTRACTS_EVENT,
        () => getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_CONTRACTS_EVENT));

      socket.on(socketMessage.UPDATE_TASK_CHAIN, async (data) => {
        await controllerColumns.updateColumnsChain(data);
        await getInfoAndEmitSelector(socketMessage.GET_COLUMN_EVENT, true);
      });

      socket.on(socketMessage.MOVE_TASK, async (data) => {
        const {
          id_task,
          task_in_column,
          chainPrev,
          chain,
        } = data;

        await controllerTasks.updateTask(
          {
            id_task,
            update: {
              task_in_column,
            },
          },
          socket.handshake.user.id
        );
        await controllerColumns.updateColumnsChain(chainPrev);
        await controllerColumns.updateColumnsChain(chain);

        await getInfoAndEmitSelector(socketMessage.GET_COLUMN_EVENT, true);
        await getInfoAndEmitSelector(socketMessage.GET_TASKS_EVENT, true);
      });

      socket.on(socketMessage.CREATE_TASK, async (data) => {
        await controllerTasks.createTask(data, socket.handshake.user.id);

        await getInfoAndEmitSelector(socketMessage.GET_COLUMN_EVENT, true);

        switch (true) {
          case data && data.proposal:
            await getInfoAndEmitSelector(socketMessage.GET_PROPOSAL_TASKS, true);
            break;

          case data && data.contract:
            await getInfoAndEmitSelector(socketMessage.GET_CONTRACTS_EVENT, true);
            break;

          default:
            await getInfoAndEmitSelector(socketMessage.GET_TASKS_EVENT, true);
        }
      });

      socket.on(socketMessage.DELETE_PROPOSAL_TASK, async (id_task) => {
        await controllerTasks.deleteTask(id_task);
        await getInfoAndEmitSelector(socketMessage.GET_PROPOSAL_TASKS, true);
      });

      socket.on(socketMessage.UPDATE_TASK, async (data) => {
        const oldTask = await controllerTasks.updateTask(data, socket.handshake.user.id);

        const prevProposal = _get(oldTask, 'proposal');
        const prevContract = _get(oldTask, 'contract');
        const updatedProposal = _get(data, 'update.proposal');
        const updatedContract = _get(data, 'update.contract');

        const archiveChanged = _get(data, 'update.archive') !== _get(oldTask, 'archive', null);
        const proposalChanged = _get(data, 'update.proposal') !== _get(oldTask, 'proposal', null);
        const contractChanged = _get(data, 'update.contract') !== _get(oldTask, 'contract', null);

        // moved to/from archive
        if (archiveChanged) {
          if (updatedProposal) {
            await getInfoAndEmitSelector(socketMessage.GET_PROPOSAL_TASKS, true);
            await getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_PROPOSAL_TASKS, true);
          } else if (updatedContract) {
            await getInfoAndEmitSelector(socketMessage.GET_CONTRACTS_EVENT, true);
            await getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_CONTRACTS_EVENT, true);
          } else {
            await getInfoAndEmitSelector(socketMessage.GET_TASKS_EVENT, true);
            await getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_TASKS_EVENT, true);
            await getInfoAndEmitSelector(socketMessage.GET_DEVELOPER_TASKS_EVENT, true);
            await getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_DEVELOPER_TASKS_EVENT, true);
          }
        } else {
          if (prevProposal || updatedProposal) {
            await getInfoAndEmitSelector(socketMessage.GET_PROPOSAL_TASKS, true);
          }

          if (prevContract || updatedContract) {
            await getInfoAndEmitSelector(socketMessage.GET_CONTRACTS_EVENT, true);
          }

          if (!((!proposalChanged && updatedProposal) || (!contractChanged && updatedContract))) {
            await getInfoAndEmitSelector(socketMessage.GET_TASKS_EVENT, true);
            await getInfoAndEmitSelector(socketMessage.GET_DEVELOPER_TASKS_EVENT, true);
          }
        }
      });
    }

    function addUsersRoute() {
      socket.on(socketMessage.GET_DEVELOPER_TASKS_EVENT,
        () => getInfoAndEmitSelector(socketMessage.GET_DEVELOPER_TASKS_EVENT));

      socket.on(socketMessage.GET_ARCHIVE_DEVELOPER_TASKS_EVENT,
        () => getInfoAndEmitSelector(socketMessage.GET_ARCHIVE_DEVELOPER_TASKS_EVENT));
    }

    function addCommonRoute() {
      socket.on(socketMessage.GET_CURRENT_USER, async () => {
        const req = {
          params: {
            login: socket.handshake.user.login,
          },
        };

        const res = {};
        res.send = (data) => {
          socket.emit(socketMessage.GET_CURRENT_USER, data);
        };
        await controllerUser.getUser(req, res);
      });

      socket.on(socketMessage.GET_ALL_USERS, async () => {
        const req = {
          body: {
            filter: {
              status: 'active',
            },
            sort: [['id', 'ASC']],
          },
        };
        const res = {};

        /* eslint-disable func-names */
        res.status = function () {
          return this;
        };
        res.send = (data) => {
          socket.emit(socketMessage.GET_ALL_USERS, data);
        };
        await controllerUser.getUsers(req, res);
      });

      socket.on(socketMessage.GET_ALL_MESSAGES_BY_TASK, async (task) => {
        if (!task) {
          return;
        }
        const result = await controllerChat.getMessagesByTask(task);
        if (result) {
          socket.emit(socketMessage.GET_APPEND_MESSAGE_BY_TASK, {
            task,
            result,
          });
        }
      });

      socket.on(socketMessage.GET_TASK_HISTORY_EVENTS, async (taskId) => {
        if (!taskId) {
          return;
        }
        const history = await controllerTasks.getTaskHistory(taskId);
        if (history) {
          socket.emit(socketMessage.GET_TASK_HISTORY_EVENTS, {
            taskId,
            history,
          });
        }
      });

      socket.on(socketMessage.GET_READED_STATUSES_BY_TASK, async (task) => {
        if (!task) {
          return;
        }
        const result = await controllerChat.getReadStatusesByTask(task);
        if (result) {
          socket.emit(socketMessage.GET_APPEND_READ_STATUS_BY_TASK, {
            task,
            result,
          });
        }
      });

      socket.on(socketMessage.GET_COUNT_UNREAD_MESSAGES_BY_USER_TASK, async ({ task, user }) => {
        if (!task || !user) {
          return;
        }
        const result = await controllerChat.getCountUnreadMessages(task, user);
        if (result) {
          socket.emit(
            socketMessage.GET_COUNT_UNREAD_MESSAGES_BY_USER_TASK,
            result
          );
        }
      });

      socket.on(socketMessage.PUT_MESSAGE, async (data) => {
        if (!data) {
          return;
        }
        const result = await controllerChat.putNewMessage(data);

        if (result.message) {
          io.emit(socketMessage.GET_APPEND_MESSAGE_BY_TASK, {
            task: result.message.crm_tasks_id,
            result: [result.message],
          });
        }

        if (result.association) {
          io.emit(socketMessage.GET_APPEND_READ_STATUS_BY_TASK, {
            task: result.message.crm_tasks_id,
            result: result.association,
          });
        }
      });

      socket.on(socketMessage.PUT_READED_DATE, async (data) => {
        if (!data) {
          return;
        }
        const result = await controllerChat.putReadedStatus(data);
        if (result) {
          io.emit(socketMessage.GET_APPEND_READ_STATUS_BY_TASK, result);
        }
      });

      socket.on(socketMessage.GET_TECNOLOGY_LIST, async () => {
        const res = {};
        /* eslint-disable func-names */
        res.status = function () {
          return this;
        };
        res.json = (data) => {
          if (data) {
            socket.emit(socketMessage.GET_TECNOLOGY_LIST, data);
          }
        };

        await controllerTechnology.getTechnologies({}, res);
      });

      socket.on(socketMessage.GET_ALL_REJECT_REASONS_LIST, async () => {
        const res = {};
        res.status = function () {
          return this;
        };
        res.json = (data) => {
          if (data) {
            socket.emit(socketMessage.GET_ALL_REJECT_REASONS_LIST, data);
          }
        };

        await getRejectReasons(null, res);
      });

      socket.on(
        socketMessage.PUT_PUSH_SUBSCRIPTION_OBJECT,
        async (pushSubscription) => {
          const req = {
            params: {
              login: socket.handshake.user.login,
            },
            body: pushSubscription,
          };

          const res = {};
          res.send = function () {
            return this;
          };
          res.status = function () {
            return this;
          };

          await controllerNotifications.addUserNotificationsPushSubscriber(
            req,
            res
          );
        }
      );
    }

    /**
     * Gets the nessesary information from database selected by message
     * type end emit it to the socket
     * @param {*} message - type of servers message (from constants)
     * @param {*} global optional / emit globally (io.emit) or direct (socket.emit)
     */
    async function getInfoAndEmitSelector(message, global = false) {
      try {
        if (!message) {
          throw new Error('no message');
        }

        switch (message) {
          case socketMessage.GET_TASKS_EVENT:
            await getInfoAndEmit(
              socketMessage.GET_TASKS_EVENT,
              TaskSelector.task,
              global
            );
            break;

          case socketMessage.GET_ARCHIVE_TASKS_EVENT:
            await getInfoAndEmit(
              socketMessage.GET_ARCHIVE_TASKS_EVENT,
              TaskSelector.taskArchive,
              global
            );
            break;

          case socketMessage.GET_PROPOSAL_TASKS:
            await getInfoAndEmit(
              socketMessage.GET_PROPOSAL_TASKS,
              TaskSelector.proposalTask,
              global
            );
            break;

          case socketMessage.GET_ARCHIVE_PROPOSAL_TASKS:
            await getInfoAndEmit(
              socketMessage.GET_ARCHIVE_PROPOSAL_TASKS,
              TaskSelector.proposalTaskArchive,
              global
            );
            break;

          case socketMessage.GET_CONTRACTS_EVENT:
            await getInfoAndEmit(
              socketMessage.GET_CONTRACTS_EVENT,
              TaskSelector.contractTask,
              global
            );
            break;

          case socketMessage.GET_ARCHIVE_CONTRACTS_EVENT:
            await getInfoAndEmit(
              socketMessage.GET_ARCHIVE_CONTRACTS_EVENT,
              TaskSelector.contractTaskArchive,
              global
            );
            break;

          case socketMessage.GET_DEVELOPER_TASKS_EVENT:
            await getDevelopersTasksAndEmit(
              socketMessage.GET_DEVELOPER_TASKS_EVENT,
              false
            );
            break;

          case socketMessage.GET_ARCHIVE_DEVELOPER_TASKS_EVENT:
            await getDevelopersTasksAndEmit(
              socketMessage.GET_ARCHIVE_DEVELOPER_TASKS_EVENT,
              true
            );
            break;

          case socketMessage.GET_TASK_FOR_ANALYTICS:
            await getInfoAndEmit(
              socketMessage.GET_TASK_FOR_ANALYTICS,
              undefined,
              global,
              controllerTasks.getTasksForAnalytics
            );
            break;

          case socketMessage.GET_COLUMN_EVENT:
            await getInfoAndEmit(
              socketMessage.GET_COLUMN_EVENT,
              undefined,
              global,
              controllerColumns.getColumns
            );
            break;

          default:
        }
      } catch (error) {
        console.error(`Error in getInfoAndEmitSelector: ${error}`);
      }
    }

    /**
     * Do select from controllers and emit result
     * @param {string} message - type of servers message (from constants)
     * @param {any} options - param passed into controller callback
     * @param {boolean} global - optional / emit globally (io.emit) or direct (socket.emit)
     * @param {function} controllerCallbak - optional / controller callback
     */
    async function getInfoAndEmit(
      message,
      options,
      global = false,
      controllerCallbak = null
    ) {
      const result = controllerCallbak
        ? await controllerCallbak(options)
        : await controllerTasks.getTasks(options);

      if (result) {
        if (global) {
          io.emit(message, result);
        } else {
          socket.emit(message, result);
        }
      }
    }

    async function getDevelopersTasksAndEmit(message, options) {
      const resultDevelopers = await controllerTasks.getDeveloperTasks(
        socket.handshake.user.id,
        options
      );
      if (resultDevelopers) {
        socket.emit(message, resultDevelopers);
      }
    }
  });
};

module.exports = connectRoute;
