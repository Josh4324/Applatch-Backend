"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Addictive extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Addictive.hasOne(models.User, {
        foreignKey: "id",
        as: "user",
      });
    }
  }
  Addictive.init(
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      packageName: DataTypes.STRING,
      icon: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Addictive",
    }
  );
  return Addictive;
};
