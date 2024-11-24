const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

let poolMemberData = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER }, 
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.BOOKING }, 
    status: { type: String, default: config.requestStatus[0] },
    individual_fare:{type: Number,required: true},
  });
  poolMemberData.plugin(mongooseTimestamp);
  
  const pool_members = mongoose.model("pool_members", poolMemberData);
  module.exports = pool_members;