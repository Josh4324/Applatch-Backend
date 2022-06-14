const express = require("express");
const router = express.Router();
const Token = require("../helpers/Token");
const schedulelockController = require("../controllers/schedulelock");
const validation = require("../middlewares/validation");

const token = new Token();

router.post(
  "/",
  token.verifyToken,
  validation.scheduleLockValidationRules(),
  validation.validate,
  schedulelockController.createScheduleLock
);

router.patch(
  "/",
  token.verifyToken,
  validation.statusValidationRules(),
  validation.validate,
  schedulelockController.updateScheduleLock
);

router.post(
  "/verify",
  token.verifyToken,
  validation.lockVerifyValidationRules(),
  schedulelockController.verifyScheduleLockService
);

module.exports = router;
