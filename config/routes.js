"use strict";

const glob = require("glob");
const winston = require("./winston");

module.exports = (app) => {
  winston.info("routes are loading ...");
  let routePath = "app/modules/**/*.routes.js";
  glob.sync(routePath).forEach(function (file) {
    console.log('file', file)
    require("../" + file)(app);
    winston.info(file + " is loaded");
  });
};
