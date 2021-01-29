

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('messages_users', [
    {
      user_id: 1,
      message_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 2,
      message_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 3,
      message_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 3,
      message_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 3,
      message_id: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('messages_users', null, {}),
};
