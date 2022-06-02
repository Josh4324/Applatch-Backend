const express = require("express");
const router = express.Router();
const Token = require("../helpers/Token");
const userController = require("../controllers/user");
const validation = require("../middlewares/validation");

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
  validation.resetValidationRules(),
  validation.validate,
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

module.exports = router;
