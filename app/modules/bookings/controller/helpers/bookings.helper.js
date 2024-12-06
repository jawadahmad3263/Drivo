const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');

function generateBookingResponse(data) {
    console.log('data?.rider_id', data?.rider_id)
    return {
        id: data?._id,
        ride_type: data?.ride_type, // pool/single
        ride_class: data?.ride_class, // business/economy/bike
        status: data?.status,
        rider: data?.rider_id,
        booker: data?.booker_id,
        estimated_time: data?.estimated_time, // in minutes
        estimated_distince: data?.estimated_distince, // in meters
        start_location: data?.start_location, // { lat, lng }
        end_location: data?.end_location, // { lat, lng }
        total_fare: data?.total_fare,
        payment_status: data?.payment_status,
        ride_cancelled_at:data?.ride_cancelled_at,
        ride_cancelled_by:data?.ride_cancelled_by,
        // Pool-specific fields
        pool_gender: data?.pool_gender, // all/male/female
        pool_members_length: data?.pool_members_length, 
        rider_accept_at:data.rider_accept_at||null,
        ride_start_at:data.ride_start_at||null,
        pool_date: data?.pool_date,
        pool_time: data?.pool_time&&commonLib.formatUtcToStringTime(data?.pool_time),
        pool_members:data?.pool_members,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    };
}

function generatePoolMemberResponse(data) {
    return {
        id: data?.id,
        status:data?.status,
        individual_fare:data?.individual_fare,
        user_id:data?.user_id,
        request_accept_at:data.request_accept_at,
        request_cancelled_at:data.request_cancelled_at,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    }
}   
function generateRiderRequestResponse(data) {
    return {
        request_id: data?._id,
        status: data?.status,
        demanded_fare: data?.demanded_fare,
        rider_id: data?.rider_id._id,
        booking_id:data?.booking_id,
        profile_image: data?.rider_id?.user_profile?.profile_image
            ? `${BASE_URL}/${data?.rider_id?.user_profile.profile_image}`
            : null,
        firstName: data?.rider_id?.user_profile?.first_name,
        lastName: data?.rider_id?.user_profile?.last_name,
        rating: data?.rider_id?.rider_profile?.rating,
        total_stars: data?.rider_id?.rider_profile?.total_stars,
        completed_rides: data?.rider_id?.rider_profile?.completed_rides,
        location: data?.rider_id?.user_location?.location,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
    }
}  
module.exports = {
    generateBookingResponse,
    generatePoolMemberResponse,
    generateRiderRequestResponse
}