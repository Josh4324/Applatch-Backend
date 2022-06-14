const ScheduleLockApps = require("../models/index")["ScheduleLockApps"];
const { Op } = require("sequelize");

module.exports = class LockService {
  async findApps(scheduleId) {
    return await ScheduleLockApps.findAll({
      where: { scheduleId },
    });
  }

  async createApp(body) {
    return await ScheduleLockApps.create(body);
  }

  async updateApp(scheduleId, payload) {
    return await ScheduleLockApps.update(payload, {
      where: {
        scheduleId,
      },
    });
  }

  async deleteApp(scheduleId, packageName) {
    return await ScheduleLockApps.destroy({
      where: {
        scheduleId,
        packageName,
      },
    });
  }
};
