module.exports = {
  up: queryInterface => queryInterface.renameColumn('crm_tasks', 'event_desctiption', 'event_description'),
  down: queryInterface => queryInterface.renameColumn('crm_tasks', 'event_description', 'event_desctiption'),
};
