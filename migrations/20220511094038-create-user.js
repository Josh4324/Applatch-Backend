"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
      },
      partner_email: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      referral_code: {
        type: Sequelize.STRING,
      },
      referral_num: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      referral_current: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      current_amount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      verify: {
        type: Sequelize.BOOLEAN,
      },
      partner_email_verify: {
        type: Sequelize.BOOLEAN,
      },
      onboardStage: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Users");
  },
};
