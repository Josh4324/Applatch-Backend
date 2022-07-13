"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleModeApps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ScheduleModeApps.init(
    {
      scheduleModeId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      packageName: DataTypes.STRING,
      icon: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ScheduleModeApps",
    }
  );
  return ScheduleModeApps;
};
