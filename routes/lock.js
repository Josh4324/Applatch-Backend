const express = require("express");
const router = express.Router();
const Token = require("../helpers/Token");
const lockController = require("../controllers/lock");
const validation = require("../middlewares/validation");

const token = new Token();

router.post(
  "/",
  token.verifyToken,
  validation.lockValidationRules(),
  validation.validate,
  lockController.createLock
);

router.patch(
  "/",
  token.verifyToken,
  validation.statusValidationRules(),
  validation.validate,
  lockController.updateLock
);

router.post(
  "/verify",
  token.verifyToken,
  validation.lockVerifyValidationRules(),
  lockController.verifyLock
);

module.exports = router;
