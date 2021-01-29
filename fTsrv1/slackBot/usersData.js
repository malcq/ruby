const { WebClient } = require('@slack/client');
const config = require('../config/index');
const db = require('../models/index');

const { Op } = db.Sequelize;

const webClient = new WebClient(config.slackToken);

async function updateUserConversationId(req) {
  try {
    const usersList = await webClient.apiCall('users.list');
    let userId = null;
    for (let i = 0; i < usersList.members.length; i += 1) {
      const member = usersList.members[i];
      if (member.profile && member.profile.display_name === req.body.slack_name) {
        userId = member.id;
        break;
      }
    }
    const result = await updateUser(userId, req.userData.login, req.body.slack_name);
    return { error: null, result };
  } catch (error) {
    console.error('updateUserConversationId', error.message);
    return { error: error.message };
  }
}

async function updateAllUsersConversationId() {
  const options = {
    where: {
      slack_name: { [Op.ne]: null },
    },
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt'],
    },
  };

  try {
    const allUserInDb = await db.user.findAll(options);

    if (!allUserInDb.length) {
      throw new Error('No users found with slack_name');
    }

    const usersList = await webClient.apiCall('users.list');

    for (const user of allUserInDb) {
      let userId = null;

      for (let i = 0; i < usersList.members.length; i += i) {
        const member = usersList.members[i];
        if (member.profile && member.profile.display_name === user.slack_name) {
          userId = member.id;
          break;
        }
      }

      await updateUser(userId, user.login, user.slack_name);
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
  return true;
}

async function updateUser(userId, login, slack_name) {
  try {
    if (userId === null) {
      throw new Error(`There are no user "${slack_name}" in our workspace`);
    } else {
      const result = await webClient.apiCall('im.open', { user: userId });

      if (result && result.ok) {
        const slack_conversational_id = result.channel.id;

        await db.user.update(
          {
            slack_conversational_id,
          },
          {
            where: { login },
          }
        );
        console.log(
          `The slack_conversational for ${userId} ${slack_name} was updated: ${slack_conversational_id}`
        );
        return true;
      }
      throw new Error(`Can't load conversationalId for Id: ${userId}`);
    }
  } catch (error) {
    console.error('Update user slack info', error.message);
    return false;
  }
}

module.exports = {
  updateUserConversationId,
  updateAllUsersConversationId,
};
