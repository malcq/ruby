const db = require('../models/index');


const addUserNotificationsPushSubscriber = async (req, res) => {
  try {
    const { login } = req.params;
    const pushSubscription = req.body;
    const options = {
      where: { login },
      attributes: {
        exclude: ['password', 'updatedAt'],
      },
      include: [{
        model: db.subscription_notification,
      }],
    };

    if (!pushSubscription.endpoint || !pushSubscription.keys.auth) {
      throw new Error('no endpoint or keys.auth found');
    }

    const userFound = await db.user.findOne(options);
    if (!userFound) {
      throw new Error(`no user found with login= ${login}`);
    }

    const auth_key = pushSubscription.keys.auth;
    const userSubscriptions = await userFound.getSubscription_notifications();

    for (const subscription of userSubscriptions) {
      if (subscription.auth_key === auth_key) {
        return res.status(204).send({ message: 'Subscription already in db' });
      }
    }

    const data = {
      auth_key,
      subscription: pushSubscription,
      user_id: userFound.id,
    };

    const result = await db.subscription_notification.create(data);
    if (!result) {
      throw new Error(`error create subscription to user_id ${userFound.id}`);
    }

    return res.status(201);
  } catch (error) {
    return res.status(500).send({ message: `Error in addUserNotificationsPushSubscriber method: ${error}` });
  }
};


const removeUserNotificationsPushSubscriber = async (subscription) => {
  try {
    if (!subscription.keys.auth) {
      throw new Error('no keys.auth found');
    }

    const options = {
      where: {
        auth_key: subscription.keys.auth,
      },
    };

    const result = await db.subscription_notification.destroy(options);
    if (!result) {
      throw new Error(`no subscription found with key= ${subscription.keys.auth}`);
    }
  } catch (error) {
    console.log('stm wrong');
  }
};


module.exports = {
  addUserNotificationsPushSubscriber,
  removeUserNotificationsPushSubscriber,
};
