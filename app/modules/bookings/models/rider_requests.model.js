const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

let riderReqData = new mongoose.Schema({
    rider_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER }, 
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.BOOKING }, 
    status: { type: String, default: config.requestStatus[0] },
    demanded_fare:{type: Number},
  });
  riderReqData.plugin(mongooseTimestamp);
  
  const rider_request = mongoose.model("rider_request", riderReqData);
  module.exports = rider_request;