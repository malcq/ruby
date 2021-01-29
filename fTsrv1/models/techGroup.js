
module.exports = (sequelize, DataTypes) => {
  const techGroup = sequelize.define('techGroup', {
    title: {
      type: DataTypes.STRING,
      notEmpty: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {});
  techGroup.associate = (models) => {
    // associations can be defined here
    models.techGroup.hasMany(models.technology, {
      foreignKey: 'group_id',
    });
  };
  return techGroup;
};
