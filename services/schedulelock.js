const ScheduleLock = require("../models/index")["ScheduleLock"];
const ScheduleLockDays = require("../models/index")["ScheduleLockDays"];
const ScheduleLockApps = require("../models/index")["ScheduleLockApps"];
const { Op } = require("sequelize");

module.exports = class LockDailyService {
  async findScheduleLock(userId) {
    return await ScheduleLock.findAll({
      where: { userId },
      include: [
        {
          model: ScheduleLockDays,
          as: "days",
        },
        {
          model: ScheduleLockApps,
          as: "apps",
        },
      ],
    });
  }

  async findScheduleLockWithUserId(userId) {
    return await ScheduleLock.findOne({
      where: {
        userId,
        end_verify: false,
      },
      include: [
        {
          model: ScheduleLockDays,
          as: "days",
        },
        {
          model: ScheduleLockApps,
          as: "apps",
        },
      ],
    });
  }

  async createScheduleLock(user) {
    return await ScheduleLock.create(user);
  }

  async updateScheduleLock(id, payload) {
    return await ScheduleLock.update(payload, {
      where: {
        id,
      },
    });
  }
};
