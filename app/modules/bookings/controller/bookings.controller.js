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
        let addbookingObj = {
            ride_type: req.body.ride_type.toLowerCase(),
            ride_class:req.body.ride_class.toLowerCase(),
            booker_id: req.user._id,
            estimated_time:parseFloat(req.body.estimated_time),
            estimated_distince:parseFloat(req.body.estimated_distince),
            start_location: {
                lat: parseFloat(req.body.start_location.lat),
                lng: parseFloat(req.body.start_location.lng),
            },
            end_location: {
                lat: parseFloat(req.body.end_location.lat),
                lng: parseFloat(req.body.end_location.lng),
            },
            total_fare:req.body.total_fare,
        }
        if(req.body.ride_type.toLowerCase()===config.rideTypes[1]){
        req.body.pool_date = new Date(req.body.pool_date),
        req.body.pool_date=req.body.pool_date.setUTCHours(0, 0, 0, 0);//as we dont need the time part time have its field
        addbookingObj ={
            //pool specific field
            ...addbookingObj,
            pool_gender: req.body.pool_gender.toLowerCase(),
            pool_members_length:parseInt(req.body.pool_members_length),
            // pool_member_fare:parseFloat(req.body.pool_member_fare),
            pool_date: req.body.pool_date,
            pool_time:commonLib.stringTimeToUtcTime(req.body.pool_time)
        } }
        return commonHelper
        .addNew({
            model: config.databaseModels.BOOKING,
            newObj:addbookingObj
        })
        .then(async(bookingObj) => {
            if(req.body.ride_type.toLowerCase()===config.rideTypes[1])
            await commonHelper
            .addNew({
                model: config.databaseModels.POOL_MEMBER,
                newObj:{
                    booking_id: bookingObj._id,
                    user_id: req.user._id,
                    status:config.requestStatus[1],
                    request_accept_at:Date.now()
                }
            })
            req.bookingObj = bookingObj
            req.message = `New ${req.body.ride_type} request`
            return next()
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
let bookingResponse = (req, res, next) => {
    try {
        console.log('req.bookingObj', req.bookingObj)
        return responseModule.successResponse(res, {
            success: 1,
            message: req.message,
            data: bookingHelper.generateBookingResponse(req.bookingObj),
        })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let addPoolMember = async (req, res, next) => {
    try {
        return commonHelper
            .addNew({
                model: config.databaseModels.POOL_MEMBER,
                newObj: {
                    booking_id: req.body.booking_id,
                    user_id: req.user._id
                }
            })
            .then((addedObj) => {
                req.poolMemberRequest = addedObj
                req.action = 'Your Request has been added'
                return next()
            })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0015', status: 403 })
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
    getAllBookings,
    addPoolMember
}