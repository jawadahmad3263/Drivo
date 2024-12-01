const config = require('../../../../config/config.json')
;(commonHelper = require('../../globals/commonHelper')),
    (commonLib = require('../../globals/global.library')),
    (reviewHelper = require('../controller/helpers/reviews.helper')),
    (responseModule = require('../../../../config/response'))
const {
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
} = require('../../../../config/constants.js')

let addNewReview = async (req, res, next) => {
    try {
        return commonHelper
            .addNew({
                model: config.databaseModels.REVIEWS,
                newObj: {
                    stars: parseFloat(req.body.stars),
                    comment: req.body.comment || '',
                    review_on: req.body.review_on,
                    review_by: req.user._id,
                    booking_id:req.body.booking_id||null
                },
            })
            .then((addedObj) => {
                req.reviewObj = addedObj
                let notificationObj = {
                    title:config.notification.title.reviewd,
                    description: config.notification.reviewd,
                    notification_by: req.user._id,
                    notification_for:req.body.review_on,
                    booking_id:req.body.booking_id
                }
                
                req.notificationObj = notificationObj;
                req.notifyUser=true;
                req.action = 'Review has been added'
                next()
            })
    } catch (error) {
        console.log('error', error)
        return next({ msgCode: '0015', status: 403 })
    }
}
let updateOverAllRatings = async (req, res, next) => {
    try {
        let reviewCount = await commonHelper.getCount({
            model: config.databaseModels.REVIEWS,
            queryObj: { review_on: req.reviewObj.review_on },
        })
        let rider_profile = await commonHelper.queryRow({
            model: config.databaseModels.RIDER_PROFILE,
            queryObj: { user_id: req.reviewObj.review_on },
        })
        if (reviewCount > 0) {
            const totalStars = rider_profile?.total_stars + req.reviewObj.stars
            const avgRating = parseFloat((totalStars / reviewCount).toFixed(2))
            return commonHelper
                .updateRow({
                    model: config.databaseModels.RIDER_PROFILE,
                    queryObj: { user_id: req.reviewObj.review_on },
                    updatedObj: {
                        total_stars: totalStars,
                        rating: avgRating,
                    },
                })
                .then((updateObj) => {
                    return next()
                })
        }
        return next()
    } catch (error) {
        return next({ msgCode: '0015', status: 403 })
    }
}
let reviewResponse = async (req, res, next) => {
    try {
        return responseModule.successResponse(res, {
            success: 1,
            message: `${req.action} successfully`,
            data: reviewHelper.generateReviewResponse(req.reviewObj) || {},
        })
    } catch (error) {
        return next({ msgCode: '0015', status: 403 })
    }
}

let getsingleReviewDetail = async (req, res, next) => {
    try {
        const reviewObj = await commonHelper.queryRow({
            model: config.databaseModels.REVIEWS,
            queryObj: { _id: req.query.id },
            populatedObj: [
                {
                    path: 'review_by',
                    select: 'email user_type',
                    populate: {
                        path: 'user_profile',
                        select: 'first_name last_name profile_image',
                    },
                },
                { path: 'review_on', select: 'email user_type' },
            ],
        })
        req.reviewObj = reviewObj
        req.action = 'Review has been fetch'
       return next()
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}

let updateReview = async (req, res, next) => {
    try {
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
let getAllReviews = async (req, res, next) => {
    try {
        let { offset, limit, review_on } = req.query
        offset = isNaN(offset) ? DEFAULT_OFFSET : Number(offset)
        limit = isNaN(limit) ? DEFAULT_LIMIT : Number(limit)
        let queryObj = {}
        if (review_on) queryObj = { ...queryObj, review_on: review_on }
        let reviewCount = await commonHelper.getCount({
            model: config.databaseModels.REVIEWS,
            queryObj,
        })

        if (!reviewCount)
            return responseModule.successResponse(res, {
                success: 1,
                message: 'No reviews exist',
                offset: offset,
                limit: limit,
                length: 0,
                data: [],
            })
        return commonHelper
            .makeSpecializedQuery({
                model: config.databaseModels.REVIEWS,
                queryObj: queryObj,
                offset: offset,
                limit: limit,
                populatedObj: [
                    {
                        path: 'review_by',
                        select: 'email user_type',
                        populate: {
                            path: 'user_profile',
                            select: 'first_name last_name profile_image',
                        },
                    },
                    { path: 'review_on', select: 'email user_type' },
                ],
            })
            .then((reviewsList) => {
                let data = []
                reviewsList?.forEach(function (doc) {
                    data.push(reviewHelper.generateReviewResponse(doc))
                })
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'Review fetched successfully',
                    offset: offset + reviewsList.length,
                    limit: limit,
                    length: reviewCount,
                    data: data,
                })
            })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
module.exports = {
    addNewReview,
    reviewResponse,
    getsingleReviewDetail,
    updateReview,
    getAllReviews,
    updateOverAllRatings,
}
