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
                    stars: req.body.stars,
                    comment: req.body.comment || '',
                    review_on: req.body.review_on,
                    review_by: req.body.req.user._id,
                    // booking_id:req.body.booking_id
                },
            })
            .then((addedObj) => {
                req.reviewObj = addedObj
                req.action = 'Review has been added'
                next()
            })
    } catch (error) {
        return next({ msgCode: '0015', status: 403 })
    }
}
let addReviewResponse = async (req, res, next) => {
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
        })
        req.reviewObj = reviewObj
        req.action = 'Review has been fetch'
        next()
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

        if (!reviewCount) return responseModule.successResponse(res, {
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
                    { path: 'review_by', select: 'email user_type',
                     populate: { 
                        path: 'user_profile',
                        select: 'first_name last_name profile_image', 
                    }
                    }, 
                    { path: 'review_on', select: 'email user_type' }  
                ],
            })
            .then((reviewsList) => {
                let data = []
                reviewsList?.forEach(function (doc) {
                    data.push(reviewHelper.generateReviewResponse(doc),)
                })
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'Review fetched successfully',
                    offset: offset + reviewsList.length,
                    limit: limit,
                    length: reviewCount,
                    data: data
                })
            })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}
module.exports = {
    addNewReview,
    addReviewResponse,
    getsingleReviewDetail,
    updateReview,
    getAllReviews,
}
