module.exports = {
  up: queryInterface => queryInterface.sequelize.query("ALTER TYPE enum_requests_type ADD VALUE 'documents'"),

  down: (queryInterface) => {
    const query = 'DELETE FROM pg_enum '
      + 'WHERE enumlabel = \'documents\' '
      + 'AND enumtypid = ( SELECT oid FROM pg_type WHERE typname = \'enum_requests_type\')';
    return queryInterface.sequelize.query(query);
  },
};
