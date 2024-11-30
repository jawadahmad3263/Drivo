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
        profile_image:data?.user_profile?.profile_image?`${BASE_URL}/${data?.user_profile.profile_image}`:null,
        firstName: data?.user_profile?.first_name,
        lastName: data?.user_profile?.last_name,
        dob: data?.user_profile?.dob,
        city: data?.user_profile?.city,
        gender: data?.user_profile?.gender,
        emailVerified: data?.emailVerified,
        account_status:data?.account_status,
        rating:data?.rating||null,
        refresh_token:data?.refresh_token,
        super_admin:data?.super_admin,
        rider_profile:data.rider_profile?generateRiderProfileResponse(data?.rider_profile):null,
        is_available:data?.login?.is_available,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}
function generateRiderProfileResponse(data) {
    return {
        id: data?.id,
        user_id: data?.user_id,
        license_number: data?.license_number || null,
        license_expiry_date: data?.license_expiry_date || null,
        license_picture: data?.license_picture ? `${BASE_URL}/${data.license_picture}` : null,
        rating: data?.rating || 0,
        total_stars:data?.total_stars||0,
        completed_rides: data?.completed_rides || 0,
        total_earnings: data?.total_earnings || 0,
        email: data?.email || null,
        is_verified: data?.is_verified || false,
        // is_available: data?.is_available || true,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}
function generateRiderCarResponse(data) {
    return {
        id: data?.id,
        rider_profile_id: data?.rider_profile_id,
        car_number: data?.car_number || null,
        car_model: data?.car_model || null,
        car_picture: data?.car_picture ? `${BASE_URL}/${data.car_picture}` : null,
        car_color: data?.car_color || null,
        car_year: data?.car_year || null,
        car_seats: data?.car_seats || null,
        car_class:data?.car_class||null,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}
module.exports = {
    generateUserResponse,
    generateRiderProfileResponse,
    generateRiderCarResponse
}