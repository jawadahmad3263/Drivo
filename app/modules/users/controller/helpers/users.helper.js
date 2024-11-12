const bcrypt = require("bcryptjs");
const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');
const {BASE_URL} = require("../../../../../config/constants");

function generateUserResponse(data) {
    return {
        tokenData: data?.token,
        id: data?.id,
        email: data?.email,
        email_status:data?.email_status,
        phone: data?.phone,
        user_type: data?.user_type,
        profile_image:data?.userProfile?.profile_image?`${BASE_URL}/${data?.userProfile.profile_image}`:null,
        firstName: data?.userProfile?.first_name,
        lastName: data?.userProfile?.last_name,
        dob: data?.userProfile?.dob,
        city: data?.userProfile?.city,
        gender: data?.userProfile?.gender,
        emailVerified: data?.emailVerified,
        account_status:data?.account_status,
        rating:data?.rating||null,
        refresh_token:data?.refresh_token,
        super_admin:data?.super_admin,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}
module.exports = {
    generateUserResponse
}