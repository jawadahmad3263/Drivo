const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

let bookingData = new mongoose.Schema({
    ride_type: { type: String,required: true },//pool/single
    ride_class:{ type: String,required: true },//business/economy/bike
    status: { type: Number,default:config.bookingStatus[0]},
    rider_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER}, 
    booker_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER,required: true },
    estimated_time:{type:Number,required: true},//in minutes
    estimated_distince:{type:Number,required: true},//in meters
    start_location: {
        type: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
        required: true, 
      },
      end_location: {
        type: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
        required: true, 
      },
    total_fare:{type: Number,required: true},
    payment_status:{type: Number,default:0},
    //pool specific field
    pool_gender: { type: String},//all/male/female
    pool_members_length:{type: Number},//member length 4
    pool_member_fare:{type: Number},
    pool_date:{ type: Date },
    pool_time:{ type: Date},

  });
  bookingData.plugin(mongooseTimestamp);
  
  const bookings = mongoose.model("bookings", bookingData);
  module.exports = bookings;