const mongoose = require("mongoose"),
  schema = mongoose.Schema;

let userLoginData = new schema({
  device_token: { type: String },
  user_id: { type: schema.Types.ObjectId, ref: "user" },
  login_time: { type: Date, default: Date.now },
  logout_time: { type: Date, default: null }
});
const login = mongoose.model("login", userLoginData);
module.exports = login;
