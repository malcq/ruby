

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('crm_columns', [
    {
      title: 'Холодное обращение',
      idChain: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'Первичная оценка / интервью',
      idChain: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'Ответ передан заказчику',
      idChain: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'Подготовка коммерческого предложения',
      idChain: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'Клиент принимает решение',
      idChain: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'Приступили к работе',
      idChain: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'Ожидание',
      idChain: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('crm_columns', null, {}),
};
