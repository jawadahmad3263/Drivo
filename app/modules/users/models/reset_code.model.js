const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");
  const { RESET_CODE_EXPIRY_TIME } = require("../../../../config/constants");

//user reset password code schema
let resetCodeData = new mongoose.Schema({
  reset_code: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER },
  expiresAt: {
    type: Date,
    expires: `${RESET_CODE_EXPIRY_TIME}`
  }
});
resetCodeData.plugin(mongooseTimestamp);
const reset_code = mongoose.model("reset_code", resetCodeData);
module.exports = reset_code;
