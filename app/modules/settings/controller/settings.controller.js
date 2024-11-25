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
        
    } catch (error) {
        return next({ msgCode: '0015', status: 403 })
    }
}

module.exports = {
    updateEstimationFare
}