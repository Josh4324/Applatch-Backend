const Beneficiary = require("../models/index")["Beneficiary"];
const { Op } = require("sequelize");

module.exports = class BeneficiaryService {
  async findBeneficiaryWithStatus(status) {
    return await Beneficiary.findAll({
      where: {
        status,
      },
    });
  }

  async createBeneficiary(user) {
    return await Beneficiary.create(user);
  }
};
