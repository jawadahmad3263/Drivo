const glob = require("glob");
const _ = require("lodash");
const fs = require("fs");
const winston = require("./winston");

winston.info("error messages are loading ...");
let routePath = "app/modules/**/*.errors.json";
let errorObject = {
  "0001": {
    msg: {
      EN: "User does not exist."
    }
  },
  "0002": {
    msg: {
      EN: "Incorrect password."
    }
  },
  "0003": {
    msg: {
      EN: "User is not authenticated."
    }
  },
  "0004": {
    msg: {
      EN: "User is not authorized to visit the API."
    }
  },
  "0005": {
    msg: {
      EN: "Email not sent. Please try again."
    }
  },
  "0006": {
    msg: {
      EN: "Something went wrong. Please try again."
    }
  },
  "0007": {
    msg: {
      EN: "Invalid token"
    }
  },
  "0008": {
    msg: {
      EN: "Token is expired"
    }
  },
  "0009": {
    msg: {
      EN: "please provide latitude"
    }
  },
  "0010": {
    msg: {
      EN: "please provide longitude"
    }
  },
  "0011": {
    msg: {
      EN: "Not allowed to make this request"
    }
  },
  "0012": {
    msg: {
      EN: "Sorry! your account has been blocked. Kindly contact admin"
    }
  },
  "0013": {
    msg: {
      EN: "An error occurred while deleting"
    }
  },
  "0014": {
    msg: {
      EN: "An error occurred while updating"
    }
  },
  "0015": {
    msg: {
      EN: "An error occurred while adding"
    },
    "0016": {
      msg: {
        EN: "An error occurred while fetching"
      }
    }
  },
  "0017": {
    msg: {
      EN: "Token is required"
    }
  },
  "0018": {
    msg: {
      EN: "An error occured while logging"
    }
  },
  "0019": {
    msg: {
      EN: "Please provide entity id"
    }
  }

};



glob.sync(routePath).forEach(function (file) {
  _.extend(errorObject, JSON.parse(fs.readFileSync(file, "utf-8")));
  winston.info(file + " is loaded");
});

module.exports = errorObject
