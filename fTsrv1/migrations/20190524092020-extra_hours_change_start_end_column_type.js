

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('extraHours', 'start', {
      type: 'DATE USING CAST("start" as DATE)',
    }), queryInterface.changeColumn('extraHours', 'start', {
      type: Sequelize.DATE,
    }), queryInterface.changeColumn('extraHours', 'end', {
      type: 'DATE USING CAST("end" as DATE)',
    }), queryInterface.changeColumn('extraHours', 'end', {
      type: Sequelize.DATE,
    })]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.changeColumn('extraHours', 'start', {
      type: Sequelize.STRING,
    }), queryInterface.changeColumn('extraHours', 'end', {
      type: Sequelize.STRING,
    })]),
};
