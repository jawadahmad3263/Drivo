const commonLib = require('../../globals/global.library'),
commonHelper = require("../../globals/commonHelper"),
config = require("../../../../config/config.json"),
_ = require("lodash");
const mongoose = require("mongoose");
let validatebookingParams = (req, res, next) => {
    req.assert('ride_type', 4006).notEmpty()

    commonLib.validationResponse('User could not be logged in', req, next)
}


module.exports = {
    validatebookingParams
}
