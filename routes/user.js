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

router.post("/resend-email", userController.resendEmail);

router.get("/verify/:id/:token", userController.verifyEmail);

router.post("/social/signup", userController.socialSignUp);

router.post("/social/login", userController.socialLogin);

router.post("/social/check", userController.socialCheck);

router.get("/", token.verifyToken, userController.getProfileData);

router.patch("/", token.verifyToken, userController.updateProfile);

module.exports = router;
