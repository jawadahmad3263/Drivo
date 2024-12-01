const config = require('../../../../config/config.json')
;(commonHelper = require('../../globals/commonHelper')),
    (commonLib = require('../../globals/global.library')),
    (responseModule = require('../../../../config/response')),
    (usersHelper = require('../../users/controller/helpers/users.helper')),
    (notificationHelper = require('./helpers/notifications.helper'))
const {
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
    RADIUS_OF
} = require('../../../../config/constants.js')
const { sendNotification } = require('../../../../config/send_notification')

const saveToDbAndNotify = async (deviceTokens, notificationObj, multipleForIds) => {
    let notificationSaved;

    if (multipleForIds && multipleForIds.length > 0) {
        const notificationEntries = multipleForIds.map((riderId) => ({
            ...notificationObj,
            notification_for: riderId, // Assign each rider ID
        }));

        const result = await commonHelper.addMany({
            model: config.databaseModels.NOTIFICATION,
            newObjs: notificationEntries,
        });
        if (result && result.length > 0) {
            notificationSaved = result[0];
        } else {
            throw new Error('Failed to save multiple notifications');
        }
    } else {
        notificationSaved = await commonHelper.addNew({
            model: config.databaseModels.NOTIFICATION,
            newObj: notificationObj,
        });
    }

    if (!deviceTokens || deviceTokens.length === 0) {
        throw new Error('No deviceTokens available');
    }
    return sendNotification(deviceTokens, notificationSaved);
};

const getRidersDeviceTokens = async (startLocation,ride_type,ride_class) => {
    try {
        const rad = ride_type === config.rideTypes[0] ? parseInt(RADIUS_OF) : 150000;
        let queryObj =  {
            user_type:config.userTypes[2],
            car_class:ride_class,
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates:startLocation.coordinates, // Your point (lng, lat)
                    },
                    $maxDistance: rad, // Maximum distance (in meters)
                },
            },
        }
        const nearbyRiders = await commonHelper.queryAll({
            model: config.databaseModels.USER_LOCATION,
            queryObj: queryObj
        });
        const riderIds = nearbyRiders.map((location) => location.user_id.toString());

        if (riderIds.length === 0) {
            return null; // No riders nearby
        }

        const loginObjs = await commonHelper.queryAll({
            model: config.databaseModels.LOGIN,
            queryObj: {
                user_id: { $in: riderIds },
                logout_time: null, 
                is_available: true, // Ensure the rider is available
            },
        });

        const deviceTokens = loginObjs
            .map((loginObj) => loginObj?.device_token)
            .filter((token) => token !== null);

        return {deviceTokens:deviceTokens,riderIds:riderIds};
    } catch (error) {
        console.error("Error in getRidersDeviceTokens:", error);
        throw error;
    }
};

const getDeviceToken = async (id) => {
    const loginObjs = await commonHelper.queryAll({
        model: config.databaseModels.LOGIN,
        queryObj: { user_id: id, logout_time: null, is_available: true },
    })

    const deviceTokens = loginObjs
        .map((loginObj) => loginObj?.device_token)
        .filter((token) => token !== null)

    return deviceTokens.length > 0 ? deviceTokens : null
}
let newBookingNotification = async (req, res, next) => {
    let notificationObj = {
        title:config.notification.title.ride_request.replace(
            "{{ride}}",
            req.bookingObj?.ride_type
          ),
        description: config.notification.ride_request.replace(
            "{{ride}}",
            req.bookingObj?.ride_type
          ),
        notification_by: req.user._id,
        booking_id:req.bookingObj._id
    }
    let result = await getRidersDeviceTokens(req.bookingObj?.start_location,req.bookingObj.ride_type,req.bookingObj.ride_class)
    console.log('result', result) 
    if(result!==null){
    req.riderIds = result?.riderIds
    saveToDbAndNotify(result?.deviceTokens, notificationObj,req.riderIds)
    .then(() =>{return next()})
    .catch((err) => {
      console.log("err", err);
      return next();
    });
    }
    else
    return next()

}
let commonNotification = async (req, res, next) => {
    let deviceTokens
    if (req.notifyUser) {
        deviceTokens = await getDeviceToken(
            req.notificationObj?.notification_for,
        )
        req.notifyUser = false
    }
    else {
        return next()
    }
    saveToDbAndNotify(deviceTokens, req.notificationObj)
        .then(() => next())
        .catch((err) => {
            console.log('err', err)
            next()
        })
}

let markNotificationsAsRead = async (notificationList) => {
    let updatedObj = {}

    const updatePromises = notificationList.map((notification) => {
        updatedObj = {
            read: true,
            readAt: Date.now(),
        }
        return commonHelper.updateRow({
            model: config.databaseModels.NOTIFICATION,
            queryObj: { _id: notification._id },
            upsertOption: false,
            updatedObj: updatedObj,
        })
    })

    await Promise.allSettled(updatePromises)
}

let getAllNotification = async (req, res, next) => {
    try {
        let { offset, limit } = req.query
        offset = isNaN(offset) ? DEFAULT_OFFSET : Number(offset)
        limit = isNaN(limit) ? DEFAULT_LIMIT : Number(limit)
        let queryObj = { deletedAt: null, notification_for: req.user._id }
        let notificationCount = await commonHelper.getCount({
            model: config.databaseModels.NOTIFICATION,
            queryObj,
        })

        if (!notificationCount)
            return responseModule.successResponse(res, {
                success: 1,
                message: 'No notification exist',
                offset: offset,
                limit: limit,
                length: 0,
                data: [],
            })
        return commonHelper
            .querySelectedRows({
                model: config.databaseModels.NOTIFICATION,
                queryObj: queryObj,
                sortByObj: { createdAt: -1 },
                offset: offset,
                limit: limit,
                populatedObj: null,
            })
            .then((notificationList) => {
                let data = []
                notificationList?.forEach(function (doc) {
                    data.push(
                        notificationHelper.generateNotificationResponse(doc),
                    )
                })
                responseModule.successResponse(res, {
                    success: 1,
                    message: 'Notification fetched successfully',
                    offset: offset + notificationList.length,
                    limit: limit,
                    length: notificationCount,
                    data: data,
                })
                res.on('finish', () => {
                    markNotificationsAsRead(notificationList)
                })
            })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let getUnreadCount = async (req, res, next) => {
    try {
        const unreadCount = await commonHelper.getCount({
            model: config.databaseModels.NOTIFICATION,
            queryObj: {
                notification_for: req.user._id,
                deletedAt: null,
                read: false,
                readAt: null,
            },
        })
        return responseModule.successResponse(res, {
            success: 1,
            message: 'unread notification count fetched.',
            data: { unreadCount: unreadCount },
        })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let clearNotification = async (req, res, next) => {
    try {
        return commonHelper
            .updateRow({
                model: config.databaseModels.NOTIFICATION,
                queryObj: { _id: req.query.notification_id },
                upsertOption: false,
                updatedObj: {
                    read: true,
                    readAt: Date.now(),
                    deletedAt: Date.now(),
                },
            })
            .then((result) => {
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'notification deleted.',
                    data: notificationHelper.generateNotificationResponse(
                        result,
                    ),
                })
            })
    } catch (error) {
        return next({ msgCode: '0014', status: 403 })
    }
}
let readNotification = async (req, res, next) => {
    try {
        return commonHelper
            .updateRow({
                model: config.databaseModels.NOTIFICATION,
                queryObj: { _id: req.query.notification_id },
                upsertOption: false,
                updatedObj: {
                    read: true,
                    readAt: Date.now(),
                },
            })
            .then((result) => {
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'notification marked readed successfully.',
                    data: notificationHelper.generateNotificationResponse(
                        result,
                    ),
                })
            })
    } catch (error) {
        return next({ msgCode: '0014', status: 403 })
    }
}
module.exports = {
    commonNotification,
    getAllNotification,
    getUnreadCount,
    clearNotification,
    readNotification,
    getRidersDeviceTokens,
    newBookingNotification
}
