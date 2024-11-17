const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');
const {BASE_URL} = require("../../../../../config/constants");

function generateReviewResponse(data) {
    return {
        id: data?.id,
        stars: data?.stars,
        car_number: data?.car_number,
        comment: data?.comment,
        approved: data?.approved,
        review_on: data?.reviewOn,
        review_by: data?.reviewBy,
        // booking_id: data?.booking_id,//pending
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}
module.exports = {
    generateReviewResponse,
}