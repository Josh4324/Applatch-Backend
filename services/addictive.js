const Addictive = require("../models/index")["Addictive"];
const { Op } = require("sequelize");

module.exports = class UserService {
  async findAddictive(userId) {
    return await Addictive.findAll({
      where: { userId },
    });
  }

  async createAddictive(user) {
    return await Addictive.create(user);
  }

  async updateAddictive(userId, payload) {
    return await Addictive.update(payload, {
      where: {
        userId,
      },
    });
  }

  async deleteUserAppWithId(userId, packageName) {
    return await Addictive.destroy({
      where: {
        userId,
        packageName,
      },
    });
  }
};
