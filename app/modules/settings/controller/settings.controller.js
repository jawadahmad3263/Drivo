const config = require('../../../../config/config.json')
;(commonHelper = require('../../globals/commonHelper')),
    (commonLib = require('../../globals/global.library')),
    (settingsHelper = require('../controller/helpers/settings.helper')),
    (responseModule = require('../../../../config/response'))
const {
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
} = require('../../../../config/constants.js')
let updateEstimationFare = async (req, res, next) => {
    try {
        if(req.query.fare) req.query.fare = parseInt(req.query.fare)
        if(req.query.distance) req.query.distance = parseInt(req.query.distance)
        const result = await commonHelper.updateRow({
            model: config.databaseModels.FARE_ESTIMATION,
            queryObj: { _id: req.query.id },
            updatedObj: req.query,
        })
        return responseModule.successResponse(res, {
            success: 1,
            message: "Estimated fares updated sucessfully",
            data:result,
        })
    } catch (error) {
        return next({ msgCode: '0015', status: 403 })
    }
}
let getAllEstimatedFares = async (req, res, next) => {
    try {
        let result;
        if(req.query.ride_class)
        result = await commonHelper.queryRow({
            model: config.databaseModels.FARE_ESTIMATION,
            queryObj: { ride_class: config.carCategory[parseInt(req.query.ride_class)] },
        })
        else
        result = await commonHelper.queryAll({
            model: config.databaseModels.FARE_ESTIMATION,
            queryObj: {},//all category fare
        })
        return responseModule.successResponse(res, {
            success: 1,
            message: "Estimated fares fetched sucessfully",
            data:result,
        })
    } catch (error) {
        return next({ msgCode: '0016', status: 403 })
    }
}

module.exports = {
    updateEstimationFare,
    getAllEstimatedFares
}