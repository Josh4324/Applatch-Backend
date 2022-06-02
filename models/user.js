"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Addictive, {
        foreignKey: "userId",
        as: "addictive",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      partner_email: DataTypes.STRING,
      token: DataTypes.STRING,
      code: DataTypes.STRING,
      verify: DataTypes.BOOLEAN,
      partner_email_verify: DataTypes.BOOLEAN,
      onboardStage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
