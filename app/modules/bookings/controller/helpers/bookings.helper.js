const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');

function generateBookingResponse(data) {
    return {
        id: data?.id,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
        rideType: data?.ride_type, // pool/single
        rideClass: data?.ride_class, // business/economy/bike
        status: data?.status,
        riderId: data?.rider_id,
        bookerId: data?.booker_id,
        estimatedTime: data?.estimated_time, // in minutes
        estimatedDistance: data?.estimated_distince, // in meters
        startLocation: data?.start_location, // { lat, lng }
        endLocation: data?.end_location, // { lat, lng }
        totalFare: data?.total_fare,
        paymentStatus: data?.payment_status,
        // Pool-specific fields
        poolGender: data?.pool_gender, // all/male/female
        poolMembersLength: data?.pool_members_length, 
        poolMemberFare: data?.pool_member_fare,
        poolDate: data?.pool_date,
        poolTime: data?.pool_time,
    };
}

module.exports = {
    generateBookingResponse,
}