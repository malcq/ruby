const Sequelize = require('sequelize');

class BankDetails extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      IBAN: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      SWIFT: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'bank_details',
    });
  }

}

module.exports = BankDetails;
