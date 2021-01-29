const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class User extends Sequelize.Model {
  static associate(models) {

    this.hasMany(models.BankDetails, {
      onDelete: "CASCADE",
      foreignKey: {
          allowNull: false
      }
    });

    this.hasMany(models.CompletedSurveys, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    this.belongsToMany(models.Roles, { through: models.UserRoles });
    this.belongsToMany(models.Tickets, { through: models.Balances });
    this.belongsToMany(models.Tickets, { through: 'user_shares' });
    this.belongsToMany(models.InfoBlocks, { through: models.UserSyndicates });
  }
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      emailIsConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailConfirmationCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emailIsConfirmedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneIsConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phoneConfirmationCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneIsConfirmedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resetCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signUpIp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birthDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: true,
      },
      signInCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      role: {
        type: Sequelize.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'

      },
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      tableName: 'users',
    });
  }

  async setPassword(password) {
    const hash = await bcrypt.hash(password, 10);

    this.password = hash;
  }

  async comparePassword(password) {
    if (! this.password) {
      return false;
    }

    return await bcrypt.compare(password, this.password);
  }

  isAdmin() {
    return this.role !== 'user';

  }

  generateJWT() {
    return jwt.sign({
      id: this.id,
      email: this.email,
    }, process.env.SESSION_SECRET);
  }

  setConfirmationCode() {
    const emailConfirmationCode = crypto.randomBytes(64).toString('hex');

    this.emailConfirmationCode = emailConfirmationCode;

    return emailConfirmationCode;
  }

  setResetCode() {
    const resetCode = crypto.randomBytes(64).toString('hex');

    this.resetCode = resetCode;

    return resetCode;
  }

  updateSignInCount() {
    this.signInCount++;
    this.save()
  }
}

module.exports = User;
