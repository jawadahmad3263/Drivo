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
        review_on: data?.review_on,
        review_by: {
            user_id:data?.review_by?._id,
            profile_image:data?.review_by?.user_profile?.profile_image?`${BASE_URL}/${data?.review_by?.user_profile?.profile_image}`:null,
            firstName: data?.review_by?.user_profile?.first_name,
            lastName: data?.review_by?.user_profile?.last_name,
        },
        // booking_id: data?.booking_id,//pending
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}
module.exports = {
    generateReviewResponse,
}