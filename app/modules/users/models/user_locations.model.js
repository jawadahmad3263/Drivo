const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

let userLocationData = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER },
  user_type: { type: String,default: null },// adding this only for backend logic
  car_class:{ type: String},// adding this only for backend logic
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
}
});
userLocationData.plugin(mongooseTimestamp);
userLocationData.index({ location: "2dsphere" });
const user_location = mongoose.model("user_location", userLocationData);
module.exports = user_location;
