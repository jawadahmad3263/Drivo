"use strict";
const errors = require("./errors");

let successResponse = (res, data) => {
  data.response = 200;
  res.json(data);
};

let errorResponse = (res, err, msgCode) => {
  res.json({
    success: 0,
    data: {},
    message: err || errors[msgCode].msg[res.locals.lang],
    response: 304
  });
};

let errorResponseWithData = (req, res, err, data) => {
  res.status(err.statusCode || 400);
  res.json({
    success: 0,
    message: errors[msgCode].msg[res.locals.lang],
    response: err.statusCode,
    data: data
  });
};

module.exports = {
  successResponse,
  errorResponse,
  errorResponseWithData
};
