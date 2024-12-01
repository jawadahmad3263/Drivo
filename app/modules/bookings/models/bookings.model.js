const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

let bookingData = new mongoose.Schema({
    ride_type: { type: String,required: true },//pool/ride
    ride_class:{ type: String,required: true },//business/economy/bike
    status: { type: String,default:config.bookingStatus[0]},
    rider_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER}, 
    booker_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER,required: true },
    estimated_time:{type:Number,required: true},//in minutes
    estimated_distince:{type:Number,required: true},//in meters
    start_location: {
      type: {
          type: String,
          enum: ['Point'],
          required: true,
      },
      coordinates: { type: [Number], required: true }, // [lng, lat]
     },
     end_location: {
      type: {
          type: String,
          enum: ['Point'],
          required: true,
      },
      coordinates: { type: [Number], required: true }, // [lng, lat]
     },
    total_fare:{type: Number,required: true},
    payment_status:{type: String,default:config.paymentStatus[0]},
    rider_accept_at:{ type: Date },
    ride_start_at:{ type: Date },
    //pool specific field
    pool_gender: { type: String},//all/male/female
    pool_members_length:{type: Number},//member length 4
    // pool_member_fare:{type: Number},
    pool_date:{ type: Date },
    pool_time:{ type: Date},

  });
  bookingData.index({ start_location: "2dsphere" });
  bookingData.index({ end_location: "2dsphere" });
  bookingData.plugin(mongooseTimestamp);
  bookingData.virtual("pool_members", {
    ref: config.databaseModels.POOL_MEMBER,
    localField: "_id",
    foreignField: "booking_id",
    justOne: false
  });
  
  const bookings = mongoose.model("bookings", bookingData);
  module.exports = bookings;