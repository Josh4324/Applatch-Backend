const express = require("express");
const router = express.Router();
const Token = require("../helpers/Token");
const beneficiaryController = require("../controllers/beneficiary");
const validation = require("../middlewares/validation");

const token = new Token();

router.post(
  "/",
  token.verifyToken,
  validation.beneficiaryValidationRules(),
  validation.validate,
  beneficiaryController.createBeneficiary
);

router.get("/:status", token.verifyToken, beneficiaryController.getBeneficiary);

module.exports = router;
