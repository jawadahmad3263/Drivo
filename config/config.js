/* eslint-disable */
var glob = require("glob"),
  path = require("path"),
  mongoose = require("mongoose"),
  async = require("async"),
  _ = require("lodash"),
  winston = require("winston"),
  { DB_HOST, DB_NAME } = require("./constants");
fs = require("fs");

global.config = {};

module.exports = (callback) => {
  async.series(
    [
      (envCb) => {
        const dbOptions = process.env.NODE_ENV === "production"
        ? {
            tls: true, 
            tlsCAFile: path.join(__dirname, "../global-bundle.pem"), 
          }
        : {};
        const dbURI = process.env.DB_CONNECTION_URI
          ? process.env.DB_CONNECTION_URI
          : `${DB_HOST}${DB_NAME}`;
        // make connection with mongodb
        if (!mongoose.connection.readyState) {
          winston.info("database uri:", dbURI, dbOptions, process.env.NODE_ENV);
          mongoose.connect(dbURI,dbOptions);
          // autoIncrement.initialize(connection);
        } else {
          return envCb();
        }

        // when successfully connected
        mongoose.connection.on("connected", () => {
          winston.info("mongoose connection open to " + dbURI);
          return envCb();
        });

        // if the connection throws an error
        mongoose.connection.on("error", (err) => {
          return envCb(err);
        });

        // when the connection is disconnected
        mongoose.connection.on("disconnected", () => {
          return envCb("mongoose connection disconnected");
        });
      },
      (modelsCb) => {
        // Load all models
        glob("app/modules/**/*.model.js", (err, files) => {
          if (err) {
            modelsCb(err);
          } else {
            winston.info("models are loading ...");
            files.forEach((file) => {
              require(path.join(__dirname, "../", file));
              winston.info(file, "is loaded");
            });
            modelsCb();
          }
        });
      }
    ],
    (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    }
  );
};
