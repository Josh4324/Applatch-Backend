"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Social extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Social.init(
    {
      userId: { type: DataTypes.STRING, primaryKey: true },
      facebook: DataTypes.BOOLEAN,
      instagram: DataTypes.BOOLEAN,
      twitter: DataTypes.BOOLEAN,
      snapchat: DataTypes.BOOLEAN,
      tiktok: DataTypes.BOOLEAN,
      youtube: DataTypes.BOOLEAN,
      telegram: DataTypes.STRING,
      spotify: DataTypes.BOOLEAN,
      whatsapp: DataTypes.BOOLEAN,
      linkedin: DataTypes.BOOLEAN,
      pinterest: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Social",
    }
  );
  return Social;
};
