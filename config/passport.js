const passport = require("passport");
const passportJWT = require("passport-jwt");
const { AUTH_KEY } = require("./constants");
const User = require("../app/modules/users/models/users.model");
const config = require("./config.json");

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: AUTH_KEY,
};

// Configure the JWT strategy
const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (jwtPayload, done) => {
    try {
      const user = await User.findOne({ _id: jwtPayload.id });
      if (user) {
        return done(null, user, jwtPayload);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);

// Initialize Passport
passport.use(jwtStrategy);

const authenticateMiddleware = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, user, jwtPayload) => {
      if (err || !user) {
        return next({ msgCode: "0003", status: 401 });
      }
      const currentTimestamp = Math.floor(Date.now());
      if (req.path === "/change-password") {
        if (jwtPayload.exp < currentTimestamp) {
          return next({ msgCode: "0008", status: 401 });
        }
      } else {
        if (jwtPayload.exp < currentTimestamp && req.path !== "/logout") {
          return next({ msgCode: "0008", status: 401 });
        }
      }
      if (user.account_status === config.accountStatuses[2]) {
        return next({ msgCode: "0012", status: 401 });
      }
      if (user.deletedAt !== null) {
        return next({ msgCode: "0001", status: 401 });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

passport.authorize = (userType) => (req, res, next) => {
  if (userType === "All" || userType.includes(req.user.user_type)) {
    next();
  } else {
    return next({ msgCode: "0004", status: 401 });
  }
};

module.exports = { passport, authenticateMiddleware };
