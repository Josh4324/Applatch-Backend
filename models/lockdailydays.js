"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LockDailyDays extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LockDailyDays.hasOne(models.LockDaily, {
        foreignKey: "id",
        as: "lockdaily",
      });
    }
  }
  LockDailyDays.init(
    {
      lockDailyId: DataTypes.INTEGER,
      day: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "LockDailyDays",
    }
  );
  return LockDailyDays;
};
