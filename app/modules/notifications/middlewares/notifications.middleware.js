const commonLib = require('../../globals/global.library'),
    commonHelper = require('../../globals/commonHelper'),
    config = require('../../../../config/config.json')

let validateNotificationId = (req, res, next) => {
    req.assert('notification_id', 1201).notEmpty()
    commonLib.validationResponse(
        'can not proceed with missing field',
        req,
        next,
    )
}

module.exports = {
    validateNotificationId,
}
