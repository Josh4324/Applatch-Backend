const express = require("express");
const router = express.Router();
const Token = require("../helpers/Token");
const lockDailyController = require("../controllers/lockdaily");
const validation = require("../middlewares/validation");

const token = new Token();

router.post(
  "/",
  token.verifyToken,
  validation.lockDailyValidationRules(),
  validation.validate,
  lockDailyController.createLockDaily
);

router.patch(
  "/",
  token.verifyToken,
  validation.statusValidationRules(),
  validation.validate,
  lockDailyController.updateLockDaily
);

router.post(
  "/verify",
  token.verifyToken,
  validation.lockVerifyValidationRules(),
  lockDailyController.verifyLockDaily
);

module.exports = router;
