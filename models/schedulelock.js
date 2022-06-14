"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleLock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ScheduleLock.hasMany(models.ScheduleLockDays, {
        foreignKey: "scheduleId",
        as: "days",
      });

      ScheduleLock.hasMany(models.ScheduleLockApps, {
        foreignKey: "scheduleId",
        as: "apps",
      });
    }
  }
  ScheduleLock.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      repeat: DataTypes.BOOLEAN,
      end: DataTypes.TIME,
      start: DataTypes.TIME,
      status: DataTypes.STRING,
      pause_verify: DataTypes.BOOLEAN,
      end_verify: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ScheduleLock",
    }
  );
  return ScheduleLock;
};
