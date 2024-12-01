const commonLib = require('../../globals/global.library'),
commonHelper = require("../../globals/commonHelper"),
config = require("../../../../config/config.json"),
_ = require("lodash");
const mongoose = require("mongoose");
let validatebookingParams = (req, res, next) => {
    req.assert('ride_type', 4006).notEmpty()
    req.assert('ride_class', 4007).notEmpty()
    req.assert('estimated_time', 4008).notEmpty()
    req.assert('estimated_distince', 4009).notEmpty()
    req.assert('start_location', 4010).notEmpty()
    req.assert('end_location', 4011).notEmpty()
    req.assert('total_fare', 4012).notEmpty()
    if(req.body.ride_type.toLowerCase()===config.rideTypes[1]){
    req.assert('pool_gender', 4013).notEmpty()
    req.assert('pool_members_length', 4014).notEmpty()
    req.assert('pool_date', 4004).notEmpty()
    req.assert('pool_time', 4003).notEmpty()
    }
    commonLib.validationResponse('User could not be logged in', req, next)
}
let validatebookingId = (req, res, next) => {
    req.assert('booking_id', 4000).notEmpty()
   
    commonLib.validationResponse('User could not be logged in', req, next)
}
let validatePoolAcceptRejectParams= (req, res, next) => {
    req.assert('id', 4015).notEmpty()
    req.assert('status', 4016).notEmpty()
    commonLib.validationResponse('User could not be logged in', req, next)
}

module.exports = {
    validatebookingParams,
    validatebookingId,
    validatePoolAcceptRejectParams
}
