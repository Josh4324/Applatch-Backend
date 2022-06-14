"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ScheduleLocks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      repeat: {
        type: Sequelize.BOOLEAN,
      },
      end: {
        type: Sequelize.TIME,
      },
      start: {
        type: Sequelize.TIME,
      },
      status: {
        type: Sequelize.STRING,
      },
      pause_verify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      end_verify: {
        type: Sequelize.BOOLEAN,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ScheduleLocks");
  },
};
