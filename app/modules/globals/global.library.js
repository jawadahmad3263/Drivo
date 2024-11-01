const bcrypt = require('bcryptjs'),
    requestIp = require('request-ip'),
    jwt = require('jsonwebtoken'),
    commonHelper = require('./commonHelper'),
    config = require('../../../config/config.json'),
    {
        AUTH_KEY,
        TOKEN_EXPIRY,
        RESET_TOKEN_EXPIRY,
    } = require('../../../config/constants')
;(winston = require('winston')), (SALT_WORK_FACTOR = 10)
const randToken = require('rand-token')

const crypto = require('crypto')
let fetchIPAdress = (req, res, next) => {
    const clientIp = requestIp.getClientIp(req)
    req.clientIp = clientIp
    next()
}

let saltPassword = (password, cb) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return cb(err)
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) return cb(err)
            return cb(null, {
                salt: salt,
                password: hash,
            })
        })
    })
}

let validationResponse = (message, req, next) => {
    return req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            let errors = result.array().map((error) => {
                return error.message
            })
            winston.error(message + errors.join(' && '))
            return next({ msgCode: errors[0], status: 403 })
        } else {
            return next()
        }
    })
}

let createAndSaveAuthTokens = async (user, req) => {
    const payload = {
        id: user._id,
        email: user.email,
        user_type: user.user_type,
        iat: Date.now() + (TOKEN_EXPIRY ? parseInt(TOKEN_EXPIRY) : 0),
    }

    const token = jsonWebToken.sign(payload, AUTH_KEY, {
        expiresIn: TOKEN_EXPIRY,
    })

    const refreshToken = randToken.uid(100)
    user.refresh_token = refreshToken

    await commonHelper.updateRow({
        model: config.databaseModels.USER,
        queryObj: { _id: user._id, user_type: user.user_type },
        upsertOption: false,
        updatedObj: { refresh_token: refreshToken },
    })
    return {
        id: user._id,
        token,
        refresh_token: refreshToken,
        email: user.email,
        expiresIn: process.env.TOKEN_EXPIRY,
        user_type: user.user_type,
    }
}

let extractUserDataFromToken = (header) => {
    let token = header.split(' ')
    token = token[1]
    return jwt.verify(token, AUTH_KEY)
}
let generateRandomString = (length) => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
}
module.exports = {
    fetchIPAdress,
    saltPassword,
    validationResponse,
    createAndSaveAuthTokens,
    extractUserDataFromToken,
    generateRandomString,
}
