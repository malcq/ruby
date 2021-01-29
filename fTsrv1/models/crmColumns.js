module.exports = (sequelize, DataTypes) => {
  const crm_columns = sequelize.define('crm_columns', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    title: {
      type: DataTypes.STRING,
      notEmpty: true,
    },

    idChain: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },

  }, {});

  return crm_columns;
};
