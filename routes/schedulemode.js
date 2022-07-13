const express = require("express");
const router = express.Router();
const Token = require("../helpers/Token");
const schedulemodeController = require("../controllers/schedulemode");
const validation = require("../middlewares/validation");

const token = new Token();

router.post("/", token.verifyToken, schedulemodeController.createScheduleMode);

router.patch("/", token.verifyToken, schedulemodeController.updateScheduleMode);

router.delete(
  "/:lockModeId",
  token.verifyToken,
  schedulemodeController.deleteScheduleMode
);

module.exports = router;
