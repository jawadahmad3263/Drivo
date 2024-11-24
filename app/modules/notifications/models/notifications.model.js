const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

let notificationData = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    notification_for: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER }, 
    notification_by: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER }, 
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.BOOKING }, //pending right now
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null }
  });
  notificationData.plugin(mongooseTimestamp);
  
  const notification = mongoose.model("notification", notificationData);
  module.exports = notification;