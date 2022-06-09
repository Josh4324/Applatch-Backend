const LockDaily = require("../models/index")["LockDaily"];
const LockDailyDays = require("../models/index")["LockDailyDays"];
const { Op } = require("sequelize");

module.exports = class LockDailyService {
  async findLockDaily(userId) {
    return await LockDaily.findAll({
      where: { userId },
      include: [
        {
          model: LockDailyDays,
          as: "days",
        },
      ],
    });
  }

  async findLockDailyWithUserId(userId) {
    return await LockDaily.findOne({
      where: {
        userId,
        end_verify: false,
      },
      include: [
        {
          model: LockDailyDays,
          as: "days",
        },
      ],
    });
  }

  async createLockDaily(user) {
    return await LockDaily.create(user);
  }

  async updateLockDaily(id, payload) {
    return await LockDaily.update(payload, {
      where: {
        id,
      },
    });
  }
};
