const commonLib = require("../../globals/global.library");

let validateSignupParams = (req, res, next) => {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }
  req.assert("password", 5003).notEmpty();
  if (req.body.password) {
    req.assert("password", 5004).isPasswordValid();
  }
  req.assert("email", 5001).isValidEmail();
  req.assert("first_name", 5027).notEmpty();
  req.assert("phone", 5002).notEmpty();
  req.assert("user_type", 5005).notEmpty();

  commonLib.validationResponse("User could not be signup", req, next);
};
let validateLoginParams = (req, res, next) => {
  req.assert("email", 5000).notEmpty();
  req.assert("email", 5001).isValidEmail();
  req.assert("password", 5003).notEmpty();

  commonLib.validationResponse("User could not be logged in", req, next);
};
let validateEmailParams = (req, res, next) => {
  req.assert("email", 5000).notEmpty();
  req.assert("email", 5001).isValidEmail();
  commonLib.validationResponse("Please enter a valid email", req, next);
};
let validatePwdCodeParams = (req, res, next) => {
  req.assert("reset_code", 5020).notEmpty();
  commonLib.validationResponse(
    "Please enter a valid reset password code",
    req,
    next
  );
};
module.exports = {
  validateSignupParams,
  validateLoginParams,
  validateEmailParams,
  validatePwdCodeParams,
};
