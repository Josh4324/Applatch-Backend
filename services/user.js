const User = require("../models/index")["User"];
const { Op } = require("sequelize");
const Social = require("../models/index")["Social"];
const Addictive = require("../models/index")["Addictive"];

module.exports = class UserService {
  async findUserWithEmail(email) {
    return await User.findOne({
      where: { email },
      attributes: {
        exclude: ["token"],
      },
      include: [
        {
          model: Addictive,
          as: "addictive",
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
        { all: true },
        {
          model: Addictive,
          as: "addictive",
        },
      ],
    });
  }

  async findUserAndPasswordWithId(id) {
    return await User.findOne({
      where: { id },
      include: [
        {
          model: Addictive,
          as: "addictive",
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
