const Sequelize = require('sequelize');

class Draws extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      prizes: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      winners: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      numbers: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      meta: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'draws',
    });
  }

}

module.exports = Draws;
