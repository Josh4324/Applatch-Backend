'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleLockApps extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ScheduleLockApps.init({
    scheduleId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    packageName: DataTypes.STRING,
    icon: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ScheduleLockApps',
  });
  return ScheduleLockApps;
};