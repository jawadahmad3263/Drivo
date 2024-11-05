const winston = require("./winston");
const errors = require("./errors");

function error_handler(err, req, res, next) {
  res.status(err.status || 500);
      // res.writeHead(200, { "Content-Type": "text/plain" });
      winston.error(err);
      if (err.message && typeof err.message === "number") {
        err.msgCode = err.message;
      }
      if (err.status && err.msgCode) {
        res.status(err.status);

        return res.json({
          success: 0,
          message: errors[err.msgCode].msg.EN,
          response: err.status,
          data: {}
        });
      }
      if (err.name == "ValidationError") {
        res.json({
          success: 0,
          message: err.errors,
          response: 304,
          data: {}
        });
      } else {
        if (err.msgCode == "0003") {
          res.status(401);
          err.status = 401;
        }
        if (err.msgCode == "0004") {
          res.status(403);
        }

        if (err.status == 404) {
          res.json({
            success: 0,
            message: "Not Found.",
            response: 404,
            data: {}
          });
        } else if (err.status == 401) {
          res.json({
            success: 0,
            message: errors[err.msgCode].msg.EN,
            response: 400,
            data: {}
          });
        } else {
          if (!err.msgCode) {
            res.status(500);
            res.json({
              success: 0,
              message: "Something went wrong. Please try again.",
              response: 500,
              data: {}
            });
          } else {
            res.status(200);

            res.json({
              success: 0,
              message: errors[err.msgCode].msg.EN,
              response: 400,
              data: {}
            });
          }
        }
      }
}

module.exports = error_handler;
