const LockDailyDays = require("../models/index")["LockDailyDays"];
const { Op } = require("sequelize");

module.exports = class LockDailyDaysService {
  async findLockDailyDays(id) {
    return await LockDaily.findAll({
      where: { id },
    });
  }

  async createLockDailyDays(user) {
    return await LockDailyDays.create(user);
  }
};
