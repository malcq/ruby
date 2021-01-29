const Sequelize = require('sequelize');

class CompletedSurveys extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      availableUnlockedShares: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      issuedUnlockedShares: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      adwall: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'completed_surveys',
    });
  }

}

module.exports = CompletedSurveys;
