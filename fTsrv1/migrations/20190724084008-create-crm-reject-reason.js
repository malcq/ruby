

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('crm_reject_reasons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reason: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
    .then(() => queryInterface.bulkInsert(
      'crm_reject_reasons',
      [
        {
          reason: 'Нет ответа',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reason: 'Проект отменен',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reason: 'Недостаточный бюджет',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reason: 'Не устроил уровень',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reason: 'Низкое качество требований',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reason: 'Успел нанять других',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )),

  down: queryInterface => queryInterface.dropTable('crm_reject_reasons'),
};
