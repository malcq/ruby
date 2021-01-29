const Sequelize = require('sequelize');

class Tickets extends Sequelize.Model {

  static associate(models) {
    this.belongsToMany(models.Draws, { through: 'ticket_draws' });
  }

  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      ticket_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      weekdays: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      weekDraws: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      scanUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'tickets',
    });
  }

}

module.exports = Tickets;
