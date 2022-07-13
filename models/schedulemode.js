"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleMode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ScheduleMode.hasMany(models.ScheduleModeDays, {
        foreignKey: "scheduleModeId",
        as: "days",
      });

      ScheduleMode.hasMany(models.ScheduleModeApps, {
        foreignKey: "scheduleModeId",
        as: "apps",
      });
    }
  }
  ScheduleMode.init(
    {
      userId: DataTypes.INTEGER,
      modeName: DataTypes.STRING,
      isSelectDate: DataTypes.BOOLEAN,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      startTimeMinute: DataTypes.STRING,
      endTimeMinute: DataTypes.STRING,
      startTimeHour: DataTypes.INTEGER,
      endTimeHour: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ScheduleMode",
    }
  );
  return ScheduleMode;
};
