const { body, param, validationResult } = require("express-validator");
const { Response } = require("../helpers");

exports.signUpValidationRules = () => {
  return [
    // username must be an email
    body("email")
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Email is required"),
    body("password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "i"
      )
      .withMessage(
        "Password should be Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  ];
};

exports.loginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is Required"),
  ];
};

exports.resetValidationRules = () => {
  return [
    body("oldPassword")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "i"
      )
      .withMessage(
        "Password should be Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    body("newPassword")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "i"
      )
      .withMessage(
        "Password should be Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  ];
};

exports.emailValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Email is required"),
  ];
};

exports.roleValidationRules = () => {
  return [
    body("role")
      .notEmpty()
      .isAlpha()
      .trim()
      .escape()
      .withMessage("Please provide the role"),
  ];
};

exports.resetPasswordValidationRules = () => {
  return [
    body("oldPassword")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Please provide the old password"),
    body("newPassword")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Please provide the new password"),
  ];
};

exports.validate = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().map((err) =>
      extractedErrors.push({
        [err.param]: err.msg,
      })
    );
    const response = new Response(
      false,
      422,
      `Validation Error`,
      extractedErrors
    );
    return res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 401, `Access Denied`);
    res.status(response.code).json(response);
  }
};
