const commonLib = require('../../globals/global.library'),
commonHelper = require("../../globals/commonHelper"),
config = require("../../../../config/config.json"),
_ = require("lodash");
let validateSignupParams = async(req, res, next) => {
   
    if (req.body.email) {
        req.body.email = _.trim(req.body.email).toLowerCase()
    }
    if (
        await commonHelper.doesRecordExist({
            model: config.databaseModels.USER,
            queryObj: { email: req.body.email,user_type:req.body.user_type},
        })
    ) {
        return next({ msgCode: 5012, status: 409 })
    }
    req.assert('password', 5003).notEmpty()
    if (req.body.password) {
        req.assert('password', 5004).isPasswordValid()
    }
    req.assert('email', 5001).isValidEmail()
    req.assert('user_type', 5005).notEmpty()

    commonLib.validationResponse('User could not be signup', req, next)
}
let validateLoginParams = (req, res, next) => {
    req.assert('email', 5000).notEmpty()
    req.assert('email', 5001).isValidEmail()
    req.assert('password', 5003).notEmpty()

    commonLib.validationResponse('User could not be logged in', req, next)
}
let validateEmailParams = (req, res, next) => {
    req.assert('email', 5000).notEmpty()
    req.assert('email', 5001).isValidEmail()
    commonLib.validationResponse('Please enter a valid email', req, next)
}
let validatePwdCodeParams = (req, res, next) => {
    req.assert('reset_code', 5020).notEmpty()
    commonLib.validationResponse(
        'Please enter a valid reset password code',
        req,
        next,
    )
}
let validateRefreshUserTokenParams = (req, res, next) => {
    req.assert('refresh_token', 5021).notEmpty()
    commonLib.validationResponse(
        'can not proceed with missing token',
        req,
        next,
    )
}
module.exports = {
    validateSignupParams,
    validateLoginParams,
    validateEmailParams,
    validatePwdCodeParams,
    validateRefreshUserTokenParams,
}
