const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

// rider profile schema
const riderProfileData = new mongoose.Schema({
   user_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER },
   // License Information
   license_number: { type: String},
   license_expiry_date: { type: Date},
   license_picture: { type: String},
   // Rider Profile Information
   rating: { type: Number, default: 0 }, 
   total_stars:{ type: Number, default: 0 },
   completed_rides: { type: Number, default: 0 },
   total_earnings: { type: Number, default: 0 }, 
   is_verified: { type: Boolean, default: false }, 
   is_available: { type: Boolean, default: true },
  
});
riderProfileData.virtual("rider_car", {
   ref: config.databaseModels.RIDER_CAR,
   localField: "_id",
   foreignField: "rider_profile_id",
   justOne: true
 });

riderProfileData.plugin(mongooseTimestamp);
riderProfileData.index({ user_id: 1 });

const rider_profile = mongoose.model("rider_profile", riderProfileData);
module.exports = rider_profile;
