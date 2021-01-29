

const postgreSqlEscapeSingleQuotes = require('../utils/postgreSqlEscapeSingleQuotes');

// During the migration, column with oldRole values gets renamed to 'oldRole';
// Creates new field 'role' with type ARRAY(JSON);
// Then it's values converts to {title: 'string', text: 'string'} Object;

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.renameColumn('projects', 'role', 'oldRole')
    .then(() => queryInterface.addColumn('projects', 'role', {
      type: Sequelize.ARRAY(Sequelize.JSON),
    })
      .then(async () => queryInterface.sequelize.query(
        'select "id", "oldRole" from projects',
        { type: Sequelize.QueryTypes.SELECT }
      ).then((results) => {
        results.forEach((result) => {
          let { oldRole } = result;
          if (!oldRole) {
            oldRole = '';
          }
          const newObj = postgreSqlEscapeSingleQuotes(JSON.stringify({ title: 'default', text: oldRole }));
          const queryString = `update projects set role = array['${newObj}']::json[] where id=${result.id};`;
          return queryInterface.sequelize.query(queryString);
        });
      }))
      .then(() => queryInterface.removeColumn('projects', 'oldRole'))),

  // During the undo migration, column with oldRole values gets renamed to 'oldRole';
  // Creates new field 'role' with type TEXT;
  // Then object.text writes to rows 'role';
  // Unfortunately, we'll lose other data except oldRole[0].text;
  // TODO: If U have any ideas how to solve this, please text to staff_bugs channel;

  down: (queryInterface, Sequelize) => queryInterface.renameColumn('projects', 'role', 'oldRole')
    .then(() => queryInterface.addColumn('projects', 'role', {
      type: Sequelize.TEXT(),
    })
      .then(async () => queryInterface.sequelize.query(
        'select "id", "oldRole" from projects',
        { type: Sequelize.QueryTypes.SELECT }
      ).then((results) => {
        results.forEach((result) => {
          const { oldRole = [] } = result;
          let { text } = oldRole[0];
          if (!text) {
            text = '';
          }
          const formattedText = postgreSqlEscapeSingleQuotes(text);
          const queryString = `update projects set role = '${formattedText}' where id=${result.id};`;
          return queryInterface.sequelize.query(queryString);
        });
      }))
      .then(() => queryInterface.removeColumn('projects', 'oldRole'))),
};
