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
