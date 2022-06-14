"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleLockDays extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ScheduleLockDays.init(
    {
      scheduleId: DataTypes.INTEGER,
      day: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ScheduleLockDays",
    }
  );
  return ScheduleLockDays;
};
