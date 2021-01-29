const Sequelize = require('sequelize');

class Analytics extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      serviceName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'analytics',
    });
  }

}

module.exports = Analytics;
