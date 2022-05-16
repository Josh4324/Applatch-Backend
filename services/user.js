const User = require("../models/index")["User"];
const { Op } = require("sequelize");
const Social = require("../models/index")["Social"];

module.exports = class UserService {
  async findUserWithEmail(email) {
    return await User.findOne({
      where: { email },
      attributes: {
        exclude: ["token"],
      },
      include: [
        {
          model: Social,
          as: "social",
        },
      ],
    });
  }

  async findUserWithId(id) {
    return await User.findOne({
      where: { id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Social,
          as: "social",
        },
      ],
    });
  }

  async createUser(user) {
    return await User.create(user);
  }

  async updateUser(id, payload) {
    return await User.update(payload, {
      where: {
        id,
      },
    });
  }

  async updateUserWithEmail(email, payload) {
    return await User.update(payload, {
      where: {
        email,
      },
    });
  }

  async deleteUserWithId(id) {
    return await User.destroy({
      where: {
        id,
      },
    });
  }

  async deleteUserWithEmail(email) {
    return await User.destroy({
      where: {
        email,
      },
    });
  }
};
