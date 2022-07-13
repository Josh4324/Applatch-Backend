const ScheduleModeDays = require("../models/index")["ScheduleModeDays"];
const { Op } = require("sequelize");

module.exports = class LockDailyDaysService {
  async findScheduleModeDays(id) {
    return await ScheduleModeDays.findAll({
      where: { id },
    });
  }

  async findDays(scheduleModeId) {
    return await ScheduleModeDays.findAll({
      where: { scheduleModeId },
    });
  }

  async createScheduleModeDays(user) {
    return await ScheduleModeDays.create(user);
  }

  async deleteDay(scheduleModeId, day) {
    return await ScheduleModeDays.destroy({
      where: {
        scheduleModeId,
        day,
      },
    });
  }
};
