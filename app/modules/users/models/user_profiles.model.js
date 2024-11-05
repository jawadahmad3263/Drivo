const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");

// User profile schema
const userProfileData = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: config.databaseModels.USER },
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  dob: { type: Date, default: null },
  city: { type: String, default: null },
  bio: { type: String, default: null },
  profile_image: { type: String },
  phone: { type: String, default: null },
  gender:{ type: String}
});

userProfileData.plugin(mongooseTimestamp);
userProfileData.index({ user_id: 1 });

const user_profile = mongoose.model("user_profile", userProfileData);
module.exports = user_profile;
