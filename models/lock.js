"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lock.init(
    {
      userId: DataTypes.INTEGER,
      duration: DataTypes.STRING,
      status: DataTypes.STRING,
      pause_verify: DataTypes.BOOLEAN,
      end_verify: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Lock",
    }
  );
  return Lock;
};
