const Lock = require("../models/index")["Lock"];
const { Op } = require("sequelize");

module.exports = class LockService {
  async findLock(userId) {
    return await Lock.findAll({
      where: { userId },
    });
  }

  async findLockWithId(userId) {
    return await Lock.findOne({
      where: {
        userId,
        end_verify: false,
      },
    });
  }

  async createLock(user) {
    return await Lock.create(user);
  }

  async updateLock(id, payload) {
    return await Lock.update(payload, {
      where: {
        id,
      },
    });
  }
};
