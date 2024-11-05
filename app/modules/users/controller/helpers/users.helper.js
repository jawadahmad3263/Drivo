const bcrypt = require("bcryptjs");
const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');

function generateUserResponse(data) {
    return {
        tokenData: data?.token,
        id: data?.id,
        email: data?.email,
        email_status:data?.email_status,
        phone: data?.phone,
        user_type: data?.user_type,
        profilePic:data?.profilePic,
        firstName: data?.firstName,
        lastName: data?.lastName,
        dob: data?.dob,
        city: data?.city,
        gender: data?.gender,
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