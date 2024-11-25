const commonLib = require('../../globals/global.library'),
commonHelper = require("../../globals/commonHelper"),
config = require("../../../../config/config.json"),
_ = require("lodash");
const mongoose = require("mongoose");
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
let manageUserUpdation = async (req, res, next) => {
    try {
        req.updateUserPayload = {};
        req.updateUserProfilePayload = {};
        req.updateRiderProfilePayload = {};
        req.message = "noting updated"
        const userFields = Object.keys(mongoose.model(config.databaseModels.USER).schema.paths);
        const userProfileFields = Object.keys(mongoose.model(config.databaseModels.USER_PROFILE).schema.paths);
        const riderProfileFields = Object.keys(mongoose.model(config.databaseModels.RIDER_PROFILE).schema.paths);
        for (let field in req.body) {
            if (userFields.includes(field)) {
                req.updateUserPayload[field] = req.body[field];
                continue;
            }
            if (userProfileFields.includes(field)) {
                req.updateUserProfilePayload[field] = req.body[field];
                continue;
            }
            if (riderProfileFields.includes(field)) {
                req.updateRiderProfilePayload[field] = req.body[field];
                continue;
            }
        }
        if (req.files) {
            if (req.files.profile_image && req.files.profile_image[0]) {
                req.updateUserProfilePayload.profile_image = req.files.profile_image[0].path;
            }
            if (req.files.license_picture && req.files.license_picture[0]) {
                req.updateRiderProfilePayload.license_picture = req.files.license_picture[0].path;
            }
        }
        return next();
    } catch (error) {
        console.log('Caught error:', error);
        return next({ msgCode: '0014', status: 403 });
    }
};
let manageCarUpdation = async (req, res, next) => {
    try {
        req.updateCarPayload = {}
        req.message = 'noting updated'
        const carFields = Object.keys(
            mongoose.model(config.databaseModels.RIDER_CAR).schema.paths,
        )
        if(req.body.car_class)
        req.body.car_class = config.carCategory[parseInt(req.body.car_class)]
        for (let field in req.body) {
            if (carFields.includes(field)) {
                req.updateCarPayload[field] = req.body[field]
                continue
            }
        }
        if (req.files) {
            if (req.files.car_picture && req.files.car_picture[0]) {
                req.updateCarPayload.car_picture = req.files.car_picture[0].path
            }
        }
        return next()
    } catch (error) {
        console.log('Caught error:', error)
        return next({ msgCode: '0014', status: 403 })
    }
}
let validateCarParams= (req, res, next) => {
    req.assert('car_number', 5038).notEmpty(),
    req.assert('car_model', 5039).notEmpty(),
    req.assert('car_color', 5040).notEmpty(),
    req.assert('car_year', 5041).notEmpty(),
    req.assert('car_seats', 5042).notEmpty(),
    req.assert('car_class', 5043).notEmpty(),
    commonLib.validationResponse(
        'can not proceed with missing token',
        req,
        next,
    )
}
let validateCarId = (req, res, next) => {
    req.assert('id', 5037).notEmpty(),
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
    manageUserUpdation,
    validateCarParams,
    manageCarUpdation,
    validateCarId
}
