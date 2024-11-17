const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

let reviewData = new mongoose.Schema({
    stars: { type: Number, default: 0 },
    comment: { type: String, default: "" },
    review_on: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER }, 
    review_by: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER }, 
    // booking_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.BOOKING }, //pending right now
    approved: { type: Boolean, default: true }
  });
  reviewData.plugin(mongooseTimestamp);
  
  const reviews = mongoose.model("reviews", reviewData);
  module.exports = reviews;