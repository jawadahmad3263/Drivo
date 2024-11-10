const mongoose = require("mongoose"),
  config = require("../../../../config/config.json")
  schema = mongoose.Schema,
  { ADMIN_EMAIL, ADMIN_ACCOUNT_PASS } = require("../../../../config/constants"),
  bcrypt = require("bcryptjs"),
  SALT_WORK_FACTOR = 10,
  winston = require("../../../../config/winston");
  const mongooseTimestamp = require("mongoose-timestamp");

  let userData = new schema({
    email: { type: String},
    email_status:{ type: String, default:config.verificationStatus[0]},
    user_type: { type: String,default: null },
    password: { type: String, required: true },
    refresh_token: { type: String, default: null },
    reset_password_token: { type: String, default: null },
    account_status: { type: String, default: config.accountStatuses[0] },
    deletedAt: { type: Date, default: null },
    super_admin:{ type: Boolean,default:false }
  });
  userData.plugin(mongooseTimestamp);
  userData.index({ email: 1, user_type: 1 }, { unique: true });
  userData.virtual("user_profile", {
    ref: config.databaseModels.USER_PROFILE,
    localField: "_id",
    foreignField: "user_id",
    justOne: true
  });
  //hash password
  userData.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  });
  
  const user = mongoose.model("user", userData);
//   seeding super admin
  const seedAdmin = async () => {
    try {
      const admin = await user.findOne({ email: ADMIN_EMAIL });
      if (!admin) {
        const adminData = {
          email: ADMIN_EMAIL,
          password: ADMIN_ACCOUNT_PASS,
          user_type: config.userTypes[0],
          account_status: config.accountStatuses[1],
          super_admin: true,
          email_status:config.verificationStatus[1],
        };
        const newAdmin = await user.create(adminData);
        await mongoose.model(config.databaseModels.USER_PROFILE).create({
          first_name: "Super",
          last_name:"admin",
          user_id: newAdmin._id,
          city:"karachi",
          bio:"i am super admin",
          dob: new Date("1996-06-07"),
        });
        winston.info("Admin user added successfully");
      } else {
        winston.info("Admin user already added");
      }
    } catch (err) {
      winston.error("Error adding admin user:", err);
    }
  };
  
  seedAdmin();
  
  module.exports = user;