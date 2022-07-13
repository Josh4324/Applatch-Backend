"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ScheduleModes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      modeName: {
        type: Sequelize.STRING,
      },
      isSelectDate: {
        type: Sequelize.BOOLEAN,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      startTimeMinute: {
        type: Sequelize.STRING,
      },
      endTimeMinute: {
        type: Sequelize.STRING,
      },
      startTimeHour: {
        type: Sequelize.INTEGER,
      },
      endTimeHour: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ScheduleModes");
  },
};
