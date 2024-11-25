const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');

function generateEstimationResponse(data) {
    return {
        id: data?.id,
        distance: data?.distance,
        fare: data?.fare,
        ride_class: data?.ride_class,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}
module.exports = {
    generateEstimationResponse,
}