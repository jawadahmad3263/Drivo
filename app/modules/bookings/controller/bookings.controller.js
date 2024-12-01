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
                type: "Point",
                coordinates: [
                    parseFloat(req.body.start_location.lng), // Longitude first
                    parseFloat(req.body.start_location.lat), // Latitude second
                ],
            },
            end_location: {
                type: "Point",
                coordinates: [
                    parseFloat(req.body.end_location.lng), // Longitude first
                    parseFloat(req.body.end_location.lat), // Latitude second
                ],
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
        // console.log('req.bookingObj', req.bookingObj)
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
            .then((actionObj) => {
                req.actionObj = actionObj
                req.message = 'Your Request has been added'
                return next()
            })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0015', status: 403 })
    }
}
let acceptRejectPoolMember = async (req, res, next) => {
    try {
        return commonHelper
             .updateRow({
                model: config.databaseModels.POOL_MEMBER,
                queryObj:{_id:req.query.id},
                updatedObj:{
                    status:req.query.status.toLowerCase()
                }
            })
            .then((actionObj) => {
                req.actionObj = actionObj
                req.message = `pool member ${req.query.status.toLowerCase()} successfully`
                return next()
            })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0015', status: 403 })
    }
}
let commonResponse = (req, res, next) => {
    try {
        return responseModule.successResponse(res, {
            success: 1,
            message: req.message,
            data: req.actionObj,
        })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let getSingleBooking =async (req, res, next) => {
    try {
        let queryObj;
        if(!req.query.booking_id){
          queryObj={
            //pending 'current
          }
        }
        else
        {
            queryObj = { _id: req.query.booking_id }
        }
        const bookingObj = await commonHelper.queryRow({
            model: config.databaseModels.BOOKING,
            queryObj: queryObj,
            populatedObj: [
                {
                    path: 'rider_id',
                    select: '_id email user_type',
                    populate: {
                        path: 'user_profile',
                        select: 'first_name last_name profile_image',
                    },
                },
                {
                    path: 'booker_id',
                    select: '_id email user_type',
                    populate: {
                        path: 'user_profile',
                        select: 'first_name last_name profile_image',
                    },
                },
                {
                    path: 'pool_members',
                    select: '_id individual_fare status',
                    populate: {
                        path: 'user_id',
                        select: '_id email user_type',
                        populate: {
                            path: 'user_profile',
                            select: 'first_name last_name profile_image',
                        },
                    },
                },
            ],
        })
        req.bookingObj = bookingObj
        req.message = "Single booking details fetched successfully"
        return next()
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}

let updateBooking = (req, res, next) => {
    try {


        req.message = "Booking updated successfully"
        if(req.query.status)
        req.message = `Booking ${req.query.status} successfully`;
        
        return next()
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}

let getAllBookings =async (req, res, next) => {
    try {
        let { offset, limit, ride_class, booking_status,ride_type,rider_id,user_id } = req.query
        offset = isNaN(offset) ? DEFAULT_OFFSET : Number(offset)
        limit = isNaN(limit) ? DEFAULT_LIMIT : Number(limit)
        let queryObj = {}
        if(booking_status)
        queryObj = {...queryObj,status:booking_status}
        if(booking_status)
        queryObj = {...queryObj,ride_class:ride_class}
        if(ride_type)
        queryObj = {...queryObj,ride_type:ride_type}
        if(rider_id)
        queryObj = {...queryObj,rider_id:rider_id}
        if(user_id)
        queryObj = {...queryObj,booker_id:user_id}
        let bookingCount = await commonHelper.getCount({
            model: config.databaseModels.BOOKING,
            queryObj,
        })

        if (!bookingCount)
            return responseModule.successResponse(res, {
                success: 1,
                message: 'No bookings exist',
                offset: offset,
                limit: limit,
                length: 0,
                data: [],
            })
            return commonHelper
            .makeSpecializedQuery({
                model: config.databaseModels.BOOKING,
                queryObj: queryObj,
                offset: offset,
                limit: limit,
                populatedObj: [
                    {
                        path: 'rider_id',
                        select: '_id email user_type',
                        populate: {
                            path: 'user_profile',
                            select: 'first_name last_name profile_image',
                        },
                    },
                    {
                        path: 'booker_id',
                        select: '_id email user_type',
                        populate: {
                            path: 'user_profile',
                            select: 'first_name last_name profile_image',
                        },
                    },
                    {
                        path: 'pool_members',
                        select: '_id individual_fare status',
                        populate: {
                            path: 'user_id',
                            select: '_id email user_type',
                            populate: {
                                path: 'user_profile',
                                select: 'first_name last_name profile_image',
                            },
                        },
                    },
                ],
            })
            .then((bookingsList) => {
                let data = []
                bookingsList?.forEach(function (doc) {
                    data.push( bookingHelper.generateBookingResponse(doc))
                })
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'bookings fetched successfully',
                    offset: offset + bookingsList.length,
                    limit: limit,
                    length: bookingCount,
                    data: data,
                })
            })
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
    addPoolMember,
    commonResponse,
    acceptRejectPoolMember
}