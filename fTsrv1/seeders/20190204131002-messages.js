

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('messages', [
    {
      message: 'Первое сообщение чата',
      files: ['file1', 'file2'],
      author_id: 1,
      crm_tasks_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      message: 'Второе сообщение чата',
      files: '{}',
      author_id: 1,
      crm_tasks_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      message: 'Третье сообщение чата',
      files: '{}',
      author_id: 2,
      crm_tasks_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      message: 'Четвертое сообщение чата',
      files: '{}',
      author_id: 2,
      crm_tasks_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      message: 'Пятое сообщение чата',
      files: '{}',
      author_id: 3,
      crm_tasks_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('message', null, {}),
};
