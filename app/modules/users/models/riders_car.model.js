const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

// rider car schema
const riderCarData = new mongoose.Schema({
   rider_profile_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.RIDER_PROFILE },
   car_number: { type: String},
   car_model: { type: String},
   car_picture: { type: String}, 
   car_color: { type: String},
   car_year: { type: Number}, 
   car_seats:{type:Number},
   car_class:{ type: String,required: true },//business/economy/bike
   deletedAt: { type: Date, default: null },
});

riderCarData.plugin(mongooseTimestamp);
riderCarData.index({ rider_profile_id: 1 });

const rider_car = mongoose.model("rider_car", riderCarData);
module.exports = rider_car;
