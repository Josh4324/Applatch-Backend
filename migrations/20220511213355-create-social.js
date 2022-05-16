"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Socials", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      facebook: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      instagram: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      twitter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      snapchat: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tiktok: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      youtube: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      telegram: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      spotify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      whatsapp: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      linkedin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      pinterest: {
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
    await queryInterface.dropTable("Socials");
  },
};
