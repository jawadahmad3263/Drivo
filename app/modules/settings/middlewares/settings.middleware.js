const commonLib = require('../../globals/global.library'),
commonHelper = require("../../globals/commonHelper"),
config = require("../../../../config/config.json"),
_ = require("lodash");
const mongoose = require("mongoose");
let validateAddFareParams = (req, res, next) => {
    req.assert('fare_per_km', 7000).notEmpty()
    //pending
    commonLib.validationResponse('User could not be logged in', req, next)
}

let validateEstimationId= (req, res, next) => {
    req.assert('id', 7001).notEmpty()
    commonLib.validationResponse('User could not be logged in', req, next)
}
module.exports = {
    validateAddFareParams,
    validateEstimationId
}
