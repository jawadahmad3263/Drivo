const commonLib = require('../../globals/global.library'),
commonHelper = require("../../globals/commonHelper"),
config = require("../../../../config/config.json"),
_ = require("lodash");

let validateAddReviewParams = (req, res, next) => {
    req.assert("stars", 6004).notEmpty();
    req.assert("review_on", 6005).notEmpty();
    req.assert("booking_id", 4000).notEmpty();
    commonLib.validationResponse("review can not be posted", req, next);
  };
  let validateReviewIdParams = (req, res, next) => {
    req.assert("id", 6000).notEmpty();
    commonLib.validationResponse("review can not be posted", req, next);
  };
module.exports = {
    validateAddReviewParams,
    validateReviewIdParams
}