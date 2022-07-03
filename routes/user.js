const express = require("express");
const router = express.Router();
const Token = require("../helpers/Token");
const userController = require("../controllers/user");
const validation = require("../middlewares/validation");
const authorization = require("../middlewares/authorization");

const token = new Token();

router.post(
  "/signup",
  validation.signUpValidationRules(),
  validation.validate,
  userController.signUp
);

router.post(
  "/login",
  validation.loginValidationRules(),
  validation.validate,
  userController.logIn
);

router.post(
  "/forget-password",
  validation.emailValidationRules(),
  validation.validate,
  userController.forgotPassword
);

router.post(
  "/resend-email",
  validation.emailValidationRules(),
  validation.validate,
  userController.resendEmail
);

router.get("/verify/:id/:token", userController.verifyEmail);

router.post("/social/signup", userController.socialSignUp);

router.post("/social/login", userController.socialLogin);

router.post("/social/check", userController.socialCheck);

router.get("/", token.verifyToken, userController.getProfileData);

router.patch("/", token.verifyToken, userController.updateProfile);

router.post(
  "/partner",
  token.verifyToken,
  userController.addAccountabilityPartner
);

router.patch(
  "/partner/verify",
  token.verifyToken,
  userController.verifyAccountabilityPartner
);

router.patch(
  "/reset-password",
  token.verifyToken,
  userController.resetPassword
);

router.patch(
  "/reset",
  token.verifyToken,
  validation.resetValidationRules(),
  validation.validate,
  userController.reset
);

router.patch(
  "/reset-noauth",
  validation.resetNoauthValidationRules(),
  validation.validate,
  userController.resetWithoutAuth
);

router.post(
  "/admin/signup",
  validation.signUpValidationRules(),
  validation.validate,
  token.verifyToken,
  authorization.authorization("admin"),
  userController.signUpAdmin
);

router.post(
  "/admin/login",
  validation.loginValidationRules(),
  validation.validate,
  userController.logInAdmin
);

router.get("/admin/users", token.verifyToken, userController.getAllUsers);

router.get(
  "/admin/users/stats",
  token.verifyToken,
  userController.getAllUsersStats
);
router.get(
  "/admin/users/month",
  token.verifyToken,
  userController.getUsersbyMonth
);

router.get("/admin/user/:id", token.verifyToken, userController.getUserData);

router.get(
  "/admin/lockhistory/:id",
  token.verifyToken,
  userController.getUserLockHistory
);

router.get(
  "/admin/lockdailyhistory/:id",
  token.verifyToken,
  userController.getUserLockDailyHistory
);

router.get(
  "/admin/schedulelockhistory/:id",
  token.verifyToken,
  userController.getUserScheduleHistory
);

router.get("/admin/history/:id", token.verifyToken, userController.getHistory);

module.exports = router;
