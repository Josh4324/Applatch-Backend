const ScheduleModeApps = require("../models/index")["ScheduleModeApps"];
const { Op } = require("sequelize");

module.exports = class LockService {
  async findApps(scheduleModeId) {
    return await ScheduleModeApps.findAll({
      where: { scheduleModeId },
    });
  }

  async createApp(body) {
    return await ScheduleModeApps.create(body);
  }

  async updateApp(scheduleModeId, payload) {
    return await ScheduleModeApps.update(payload, {
      where: {
        scheduleModeId,
      },
    });
  }

  async deleteApp(scheduleModeId, packageName) {
    return await ScheduleModeApps.destroy({
      where: {
        scheduleModeId,
        packageName,
      },
    });
  }
};
