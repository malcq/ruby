const Sequelize = require('sequelize');

class UserSyndicates extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      unlock: {
        type: Sequelize.ENUM('true', 'false'),
        allowNull: false,
        defaultValue: 'false',
      },
      optedOut: {
        type: Sequelize.ENUM('true', 'false'),
        allowNull: false,
        defaultValue: 'false',
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'user_syndicates',
    });
  }

}

module.exports = UserSyndicates;
