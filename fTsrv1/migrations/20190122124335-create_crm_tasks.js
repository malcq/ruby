

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('crm_tasks', {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.STRING,
      notEmpty: true,
    },

    description: {
      type: Sequelize.TEXT,
    },

    subscription: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
    },

    comment: {
      type: Sequelize.STRING,
    },

    task_in_column: {
      type: Sequelize.INTEGER,
      references: {
        model: 'crm_columns',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    lid_company: {
      type: Sequelize.STRING,
    },

    lid_contact_name: {
      type: Sequelize.STRING,
    },

    lid_email: {
      type: Sequelize.STRING,
    },

    lid_skype: {
      type: Sequelize.STRING,
    },

    lid_phone: {
      type: Sequelize.STRING,
    },

    lid_location: {
      type: Sequelize.STRING,
    },

    lid_time_zone: {
      type: Sequelize.INTEGER,
    },

    additional_info_field: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },

    additional_info_data: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },

    budget: {
      type: Sequelize.STRING,
    },

    proposal_link: {
      type: Sequelize.STRING,
    },

    project_folder_path: {
      type: Sequelize.TEXT,
    },

    technologies: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },

    archive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('crm_tasks'),
};
