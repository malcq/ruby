const Sequelize = require('sequelize');

class InfoBlocks extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      ticketType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weekdays: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      weekdaysDraws: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      numbers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      isRandomNumbers: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      autoRenewal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      availableForPeriod: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: true,
        defaultValue: '0'
      },
      sharesPerTicket: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sharesForMyself: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'info_blocks',
    });
  }

}

module.exports = InfoBlocks;
