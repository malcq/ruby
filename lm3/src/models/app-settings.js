const Sequelize = require('sequelize');

class AppSettings extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
        value: {
          type: Sequelize.STRING,
          allowNull: true,
        },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'app_settings',
    });
  }

}

module.exports = AppSettings;
