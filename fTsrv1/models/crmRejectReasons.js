module.exports = (sequelize, DataTypes) => {
  const crm_reject_reasons = sequelize.define(
    'crm_reject_reasons',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      reason: {
        type: DataTypes.STRING,
        notEmpty: true,
      },
    },
    {}
  );
  crm_reject_reasons.associate = (models) => {
    models.crm_reject_reasons.hasMany(models.crm_tasks, {
      foreignKey: 'reject_reason_id',
    });
  };
  return crm_reject_reasons;
};
