const ScheduleMode = require("../models/index")["ScheduleMode"];
const ScheduleModeDays = require("../models/index")["ScheduleModeDays"];
const ScheduleModeApps = require("../models/index")["ScheduleModeApps"];
const { Op } = require("sequelize");

module.exports = class LockDailyService {
  async findScheduleMode(userId) {
    return await ScheduleMode.findAll({
      where: { userId },
      include: [
        {
          model: ScheduleModeDays,
          as: "days",
        },
        {
          model: ScheduleModeApps,
          as: "apps",
        },
      ],
    });
  }

  async findScheduleModeWithId(userId) {
    return await ScheduleMode.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: ScheduleModeDays,
          as: "days",
        },
        {
          model: ScheduleModeApps,
          as: "apps",
        },
      ],
    });
  }

  async createScheduleMode(user) {
    return await ScheduleMode.create(user);
  }

  async updateScheduleMode(id, payload) {
    return await ScheduleMode.update(payload, {
      where: {
        id,
      },
    });
  }

  async deleteMode(id) {
    return await ScheduleMode.destroy({
      where: {
        id,
      },
    });
  }
};
