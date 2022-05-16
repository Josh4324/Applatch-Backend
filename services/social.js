const Social = require("../models/index")["Social"];
const { Op } = require("sequelize");

module.exports = class UserService {
  async findSocial(userId) {
    return await Social.findOne({
      where: { userId },
    });
  }

  async createSocial(user) {
    return await Social.create(user);
  }

  async updateSocial(userId, payload) {
    return await Social.update(payload, {
      where: {
        userId,
      },
    });
  }
};
