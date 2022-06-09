"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LockDaily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LockDaily.hasMany(models.LockDailyDays, {
        foreignKey: "lockDailyId",
        as: "days",
      });
    }
  }
  LockDaily.init(
    {
      userId: DataTypes.INTEGER,
      duration: DataTypes.STRING,
      status: DataTypes.STRING,
      repeat: DataTypes.BOOLEAN,
      pause_verify: DataTypes.BOOLEAN,
      end_verify: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "LockDaily",
    }
  );
  return LockDaily;
};
