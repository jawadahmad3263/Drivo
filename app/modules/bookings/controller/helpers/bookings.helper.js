const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');

function generateBookingResponse(data) {
    return {
        id: data?.id,
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
        // Pool-specific fields
        pool_gender: data?.pool_gender, // all/male/female
        pool_members_length: data?.pool_members_length, 
        // pool_member_fare: data?.pool_member_fare,
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

module.exports = {
    generateBookingResponse,
    generatePoolMemberResponse
}