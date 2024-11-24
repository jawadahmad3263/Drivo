const config = require('../../../../config/config.json')
;(commonHelper = require('../../globals/commonHelper')),
    (commonLib = require('../../globals/global.library')),
    (responseModule = require('../../../../config/response')),
    (usersHelper = require('../../users/controller/helpers/users.helper')),
    (bookingHelper = require("../controller/helpers/bookings.helper")),
    (bcrypt = require('bcryptjs')),
    (_ = require('lodash')),
    (crypto = require('crypto'))
const {
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
} = require('../../../../config/constants.js')
let addBooking = async (req, res, next) => {
    try {
        req.message = "New booking added"
        return next()
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
let bookingResponse = (req, res, next) => {
    try {
        return responseModule.successResponse(res, {
            success: 1,
            message: req.message,
            // data: bookingHelper.generateBookingResponse,
        })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}

let getSingleBooking = (req, res, next) => {
    try {
        
        req.message = "Single booking details fetched successfully"
        return next()
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}

let updateBooking = (req, res, next) => {
    try {

        req.message = "Booking updated successfully"
        return next()
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}

let getAllBookings = (req, res, next) => {
    try {
        let { offset, limit, booking_type, booking_status } = req.query
        offset = isNaN(offset) ? DEFAULT_OFFSET : Number(offset)
        limit = isNaN(limit) ? DEFAULT_LIMIT : Number(limit)
        let queryObj = {}
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
module.exports = {
    addBooking,
    bookingResponse,
    getSingleBooking,
    updateBooking,
    getAllBookings
}