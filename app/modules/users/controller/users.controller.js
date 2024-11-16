const config = require('../../../../config/config.json')
;(commonHelper = require('../../globals/commonHelper')),
    (commonLib = require('../../globals/global.library')),
    (responseModule = require('../../../../config/response')),
    (usersHelper = require('./helpers/users.helper.js')),
    (bcrypt = require('bcryptjs')),
    (_ = require('lodash')),
    (crypto = require('crypto'))
const {
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
} = require('../../../../config/constants.js')
const {
    sendEmailVerificationCode,
    sendForgetPwdEmail,
} = require('../../../../config/email')
let signup = async (req, res, next) => {
    try {
        return commonHelper
            .addNew({
                model: config.databaseModels.USER,
                newObj: {
                    email: req.body.email,
                    user_type: req.body.user_type,
                    password: req.body.password,
                    email_verfication_code: crypto.randomInt(10000, 99999),
                },
            })
            .then((user) => {
                commonHelper
                    .addNew({
                        model: config.databaseModels.USER_PROFILE,
                        newObj: {
                            user_id: user._id,
                        },
                    })
                    .then(async (userProfile) => {
                        if (user.user_type === config.userTypes[2]) {
                            const riderProfile = await commonHelper.addNew({
                                model: config.databaseModels.RIDER_PROFILE,
                                newObj: {
                                    user_id: user._id,
                                },
                            })
                            user.rider_profile = riderProfile
                        }
                        user.userProfile = userProfile
                        req.user = user
                        req.action = 'Signup'
                        next()
                    })
            })
    } catch (error) {
        console.log('error', error)
        return res.status(403).send({
            success: 0,
            message: error,
            response: 403,
            data: {},
        })
    }
}
const login = async (req, res, next) => {
    const user = await commonHelper.queryRow({
        model: config.databaseModels.USER,
        queryObj: {
            email: _.trim(req.body.email).toLowerCase(),
            user_type: req.body.user_type
                ? req.body.user_type
                : config.userTypes[1],
        },
    })
    if (user) {
        if (user.deletedAt && user.deletedAt !== null) {
            return next({ msgCode: 5030, status: 404 })
        }

        if (user.account_status === config.accountStatuses[2]) {
            return next({ msgCode: 5034, status: 403 })
        }

        req.user = user

        const userProfile = await commonHelper.queryRow({
            model: config.databaseModels.USER_PROFILE,
            queryObj: { user_id: user._id },
        })
        req.user.user_profile = userProfile || {}

        return bcrypt
            .compare(req.body.password, user.password)
            .then((validPass) => {
                if (validPass) {
                    req.user = user
                    req.action = 'login'
                    next()
                } else {
                    return next({ msgCode: 5010, status: 403 })
                }
            })
            .catch((err) => {
                res.send(err)
            })
    } else {
        return next({ msgCode: 5033, status: 403 })
    }
}

let loginResponse = async (req, res, next) => {
    try {
        const token = await commonLib.createAndSaveAuthTokens(
            req.user,
            req.deviceToken,
        )
        req.user.token = { ...token }
        let modifiedMessage = ''
        if (req.action === 'Signup' && req.user.email_verfication_code) {
            sendEmailVerificationCode(
                req.user.email,
                req.user.email_verfication_code,
            )
            modifiedMessage = ' !Email verification code is sent to your email'
        }
        return responseModule.successResponse(res, {
            success: 1,
            message: `${req.action} successfully${modifiedMessage}`,
            data: usersHelper.generateUserResponse(req.user) || {},
        })
    } catch (error) {
        console.log('Caught Error is: ' + error)
        return next({ msgCode: '0018', status: 403 })
    }
}

const logout = async (req, res, next) => {
    try {
        let queryObj = {
            user_id: req.user._id,
            device_token: req.body?.device_token,
            logout_time: null,
        }

        await commonHelper
            .updateRow({
                model: config.databaseModels.LOGIN,
                queryObj: queryObj,
                updatedObj: { logout_time: Date.now() },
            })
            .then(() => {
                responseModule.successResponse(res, {
                    success: 1,
                    message: 'User has been logout successfully.',
                })
            })
            .catch((err) => {
                return next({ msgCode: '0006', status: 403 })
            })
    } catch (error) {
        return next({ msgCode: '0006', status: 403 })
    }
}
let createLoginObject = async (req, res, next) => {
    const previousLogin = await commonHelper.queryRow({
        model: config.databaseModels.LOGIN,
        queryObj: {
            user_id: req.user._id,
            device_token: req.body?.device_token,
        },
    })

    if (!previousLogin) {
        let loginObject = {
            device_token: req.body.device_token,
            user_id: req.user._id,
            login_time: Date.now(),
        }

        return commonHelper
            .addNew({ model: config.databaseModels.LOGIN, newObj: loginObject })
            .then(() => {
                next()
            })
            .catch((err) => {
                res.send(err)
            })
    } else {
        return commonHelper
            .updateRow({
                model: config.databaseModels.LOGIN,
                queryObj: { _id: previousLogin._id },
                updatedObj: { login_time: Date.now(), logout_time: null },
            })
            .then(() => {
                next()
            })
            .catch((err) => {
                res.send(err)
            })
    }
}

let refreshUserToken = async (req, res, next) => {
    try {
        const user = await commonHelper.queryRow({
            model: config.databaseModels.USER,
            queryObj: { refresh_token: req.body.refresh_token },
        })
        if (user) {
            let token = await commonLib.createAndSaveAuthTokens(user, req)
            let userModified = { ...user, token }
            return responseModule.successResponse(res, {
                success: 1,
                message: 'token refreshed successfully',
                data: usersHelper.generateUserResponse(userModified) || {},
            })
        }
        return next({ msgCode: '0007', status: 404 })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let getMe = async (req, res, next) => {
    try {
        const userProfile = await commonHelper.queryRow({
            model: config.databaseModels.USER_PROFILE,
            queryObj: { user_id: req.user._id },
        })
        req.user.user_profile = userProfile
        next()
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let getUserSuccessResponse = (req, res, next) => {
    try {
        return responseModule.successResponse(res, {
            success: 1,
            message: req.message || 'fetched successfully',
            data: usersHelper.generateUserResponse(req.user) || {},
        })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let getAllUsers = async (req, res, next) => {
    try {
        let { offset, limit, user_type, account_status } = req.query
        offset = isNaN(offset) ? DEFAULT_OFFSET : Number(offset)
        limit = isNaN(limit) ? DEFAULT_LIMIT : Number(limit)
        let queryObj = {}
        if (user_type) queryObj = { ...queryObj, user_type: user_type }
        if (account_status)
            queryObj = { ...queryObj, account_status: account_status }
        let usersCount = await commonHelper.getCount({
            model: config.databaseModels.USER,
            queryObj,
        })

        if (!usersCount) return next({ msgCode: 5017, status: 403 })
        return commonHelper
            .makeSpecializedQuery({
                model: config.databaseModels.USER,
                queryObj: queryObj,
                offset: offset,
                limit: limit,
                selectFields:
                    '_id email email_status user_type account_status super_admin',
            })
            .then((userList) => {
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'Users fetched successfully',
                    offset: offset + userList.length,
                    limit: limit,
                    length: usersCount,
                    data: userList,
                })
            })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0016', status: 403 })
    }
}
let deleteAccount = async (req, res, next) => {
    try {
        return commonHelper
            .softDeleteRow({
                model: config.databaseModels.USER,
                queryObj: { _id: req.user._id },
            })
            .then((user) => {
                commonHelper
                    .updateRow({
                        model: config.databaseModels.LOGIN,
                        queryObj: {
                            user_id: user._id,
                            logout_time: null,
                        },
                        updatedObj: { logout_time: Date.now() },
                    })
                    .then(() => {
                        return responseModule.successResponse(res, {
                            success: 1,
                            message: 'Account deleted successfully.',
                        })
                    })
            })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0013', status: 403 })
    }
}
let verifyEmail = async (req, res, next) => {
    try {
        const user = await commonHelper.queryRow({
            model: config.databaseModels.USER,
            queryObj: {
                email_verfication_code: parseInt(
                    req.body.email_verfication_code,
                ),
            },
        })
        if (!user) return next({ msgCode: 5035, status: 403 })
        else {
            return commonHelper
                .updateRow({
                    model: config.databaseModels.USER,
                    queryObj: { _id: user._id },
                    updatedObj: {
                        email_status: config.verificationStatus[1],
                        email_verfication_code: null,
                    },
                })
                .then(() => {
                    return responseModule.successResponse(res, {
                        success: 1,
                        message: 'Email has been verified successfully.',
                    })
                })
        }
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0014', status: 403 })
    }
}
const maskedPassword = async (req, res, next) => {
    if (req.body.password) {
        return commonLib.saltPassword(
            req.body.password,
            (err, maskedPassword) => {
                if (maskedPassword) {
                    req.body.password = maskedPassword.password
                    next()
                }
            },
        )
    }
    next()
}
let changePassword = async (req, res, next) => {
    try {
        return commonHelper
            .updateRow({
                model: config.databaseModels.USER,
                queryObj: { _id: req.user._id },
                updatedObj: { password: req.body.password },
            })
            .then((updatedUser) => {
                req.updatedUser = updatedUser
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'Password Updated',
                })
            })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0014', status: 403 })
    }
}
let updateUser = async (req, res, next) => {
    try {
        if (Object.keys(req.updateUserPayload).length === 0) return next()
        const user = await commonHelper.updateRow({
            model: config.databaseModels.USER,
            queryObj: { _id: req.user._id },
            updatedObj: req.updateUserPayload,
        })
        req.user = user
        delete req.user.password
        req.message = 'updated successfully'
        return next()
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0014', status: 403 })
    }
}
let updateUserProfile = async (req, res, next) => {
    try {
        if (Object.keys(req.updateUserProfilePayload).length === 0) {
            req.user.user_profile = await commonHelper.queryRow({
                model: config.databaseModels.USER_PROFILE,
                queryObj: { user_id: req.user._id },
            })
            return next()
        }
        const userProfile = await commonHelper.updateRow({
            model: config.databaseModels.USER_PROFILE,
            queryObj: { user_id: req.user._id },
            updatedObj: req.updateUserProfilePayload,
        })
        req.user.user_profile = userProfile
        req.message = 'updated successfully'
        return next()
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0014', status: 403 })
    }
}
let updateRiderProfile = async (req, res, next) => {
    try {
        if (Object.keys(req.updateRiderProfilePayload).length === 0) {
            if (req.user.user_type === config.userTypes[2])
                req.user.rider_profile = await commonHelper.queryRow({
                    model: config.databaseModels.RIDER_PROFILE,
                    queryObj: { user_id: req.user._id },
                })
            return next()
        }
        const riderProfile = await commonHelper.updateRow({
            model: config.databaseModels.RIDER_PROFILE,
            queryObj: { user_id: req.user._id },
            updatedObj: req.updateRiderProfilePayload,
        })
        req.user.rider_profile = riderProfile
        req.message = 'updated successfully'
        return next()
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0014', status: 403 })
    }
}
let forgetPassword = async (req, res, next) => {
    try {
        const user = await commonHelper.queryRow({
            model: config.databaseModels.USER,
            queryObj: { email: _.trim(req.body.email).toLowerCase() },
            populatedObj: 'user_profile',
        })
        if (!user) return next({ msgCode: 5033, status: 403 })
        let emailData = {
            first_name: user?.user_profile?.first_name || 'DRIVO',
            last_name: user?.user_profile?.last_name || 'USER',
            email: user?.email,
        }
        let reset_code = crypto.randomInt(1000, 10000)
        let emailSuccess = await sendForgetPwdEmail({
            ...emailData,
            reset_code: reset_code,
        })
        if (emailSuccess.accepted && emailSuccess.accepted.length > 0) {
            return commonHelper
                .addNew({
                    model: config.databaseModels.RESET_CODE,
                    newObj: {
                        user_id: user._id,
                        reset_code: reset_code,
                    },
                })
                .then((result) => {
                    return responseModule.successResponse(res, {
                        success: 1,
                        message: 'activation code has been sent to the email',
                    })
                })
        }
        next({ msgCode: 5031, status: 403 })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0014', status: 403 })
    }
}
let verifyPwdCode = async (req, res, next) => {
    try {
        const resetCodeData = await commonHelper.queryRow({
            model: config.databaseModels.RESET_CODE,
            queryObj: { reset_code: req.body.reset_code },
        })

        if (resetCodeData) {
            const user = await commonHelper.queryRow({
                model: config.databaseModels.USER,
                queryObj: { _id: resetCodeData?.user_id },
                populatedObj: 'user_profile',
            })
            req.action = 'Login'
            req.user = user
            return next()
        }
        return next({ msgCode: 5036, status: 403 })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: 5036, status: 403 })
    }
}
let addCarDetails = async (req, res, next) => {
    try {
        if (req.files.car_picture && req.files.car_picture[0])
            req.body.car_picture = req.files.car_picture[0].path
        let newObj = {
            rider_profile_id: req.user.rider_profile._id,
            car_number: req.body.car_number,
            car_model: req.body.car_model,
            car_picture: req.body.car_picture||null,
            car_color: req.body.car_color,
            car_year: req.body.car_year,
            car_seats: req.body.car_seats,
        }
       return commonHelper.addNew({
            model: config.databaseModels.RIDER_CAR,
            newObj
        }).then((addedObj)=>{
            return responseModule.successResponse(res, {
                success: 1,
                message: "Car details added successfully",
                data: usersHelper.generateRiderCarResponse(addedObj) || {},
            })
        })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0015', status: 403 })
    }
}
let getCarDetails = async (req, res, next) => {
    try {
        req.rider_car = await commonHelper.queryRow({
            model: config.databaseModels.RIDER_CAR,
            queryObj: { _id: req.query.id },
        })
        return next()
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let updateCarDetails = async (req, res, next) => {
    try {
        if (Object.keys(req.updateCarPayload).length === 0) {
            return next()
        }
        const rider_car = await commonHelper.updateRow({
            model: config.databaseModels.RIDER_CAR,
            queryObj: {_id: req.body.id },
            updatedObj: req.updateCarPayload,
        })
        req.rider_car = rider_car
        req.message = 'Car details updated successfully'
        return next()
    } catch (error) {
        return next({ msgCode: '0014', status: 403 })
    }
}
let getCarSuccessResponse = (req, res, next) => {
    try {
        return responseModule.successResponse(res, {
            success: 1,
            message: req.message,
            data: usersHelper.generateRiderCarResponse(req.rider_car) || {},
        })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
module.exports = {
    signup,
    login,
    loginResponse,
    logout,
    refreshUserToken,
    getMe,
    getUserSuccessResponse,
    createLoginObject,
    getAllUsers,
    deleteAccount,
    verifyEmail,
    maskedPassword,
    changePassword,
    updateUser,
    updateUserProfile,
    forgetPassword,
    verifyPwdCode,
    updateRiderProfile,
    addCarDetails,
    getCarDetails,
    updateCarDetails,
    getCarSuccessResponse
}
