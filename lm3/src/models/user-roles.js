const Sequelize = require('sequelize');

class UserRoles extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(46),
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'user_roles',
    });
  }

}

module.exports = UserRoles;
