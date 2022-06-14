const ScheduleLockDays = require("../models/index")["ScheduleLockDays"];
const { Op } = require("sequelize");

module.exports = class LockDailyDaysService {
  async findScheduleLockDays(id) {
    return await ScheduleLockDays.findAll({
      where: { id },
    });
  }

  async createScheduleLockDays(user) {
    return await ScheduleLockDays.create(user);
  }
};
