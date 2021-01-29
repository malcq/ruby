const Sequelize = require('sequelize');

class Roles extends Sequelize.Model {
  static associate(models) {
    this.belongsToMany(models.User, { through: models.UserRoles });
  }
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      roleName: {
        type: Sequelize.STRING(46),
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'roles',
    });
  }

}

module.exports = Roles;
