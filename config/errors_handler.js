const winston = require("./winston");
const errors = require("./errors");

function error_handler(err, req, res, next) {
  res.status(err.status || 500);
  winston.error(err);
  if (err.message && typeof err.message === "number") {
    err.msgCode = err.message;
  }

  if (err.status && err.msgCode) {
    res.status(err.status);
    res.json({
      success: 0,
      message: Number(err.msgCode) ? errors[err.msgCode].msg[res.locals.lang] : err.msgCode,
      response: err.status,
      data: {},
    });
  }
  else if (err.name === "ValidationError") {
    res.json({
      success: 0,
      message: err.errors,
      response: 304,
      data: {},
    });
  }
  else if (err.name === "MulterError" && err.code === "LIMIT_UNEXPECTED_FILE") {
    res.status(400).json({
      success: 0,
      message: res.locals.lang=="AR"?"حدث خطأ أثناء تحميل الملف. إما أن اسم الحقل خاطئ أو تجاوزت الحد الأقصى لتحميل الملفات.":"Error uploading file. Either field name is wrong or total files upload limit has exceeded",
      response: 400,
    });
  }
  else if (err.name === 'PrismaClientValidationError') {
    res.status(403).json({
      success: 0,
      message: res.locals.lang=="AR"?"خطأ في تحقق الحمولة":"PayLoad Validation Error",
      response: 403,
    });
  }
  else if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: 0,
        message: err.meta.target.length === 1 ?
          `Field '${err.meta.target[0]}' already exists` :
          `Unique constraint failed on the fields ${err.meta.target}`,
        response: 409,
      });
    }
    else {
      res.status(400).json({
        success: 0,
        message: err.meta.cause,
        response: 400,
      });
    }
  }
  else if (err.name === "MulterError" && err.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({
      success: 0,
      message: res.locals.lang=="AR"?"الملف كبير جدًا":"File(s) too large",
      response: 400,
    });
  }
  else {
    if (err.msgCode === "0003") {
      res.status(401);
      err.status = 401;
    }
    if (err.msgCode === "0004") {
      res.status(403);
    }

    if (err.status === 404) {
      res.json({
        success: 0,
        message:res.locals.lang=="AR"?"غير موجود": "Not Found.",
        response: 404,
        data: {},
      });
    } else if (err.status === 401) {
      res.json({
        success: 0,
        message: errors[err.msgCode].msg[res.locals.lang],
        response: 401,
        data: {},
      });
    } else {
      if (!err.msgCode) {
        res.status(500);
        res.json({
          success: 0,
          message: res.locals.lang=="AR"?"حدث خطأ ما. يرجى المحاولة مرة أخرى":"Something went wrong. Please try again.",
          response: 500,
          data: {},
        });
      } else {
        res.status(200);
        res.json({
          success: 0,
          message: errors[err.msgCode].msg[res.locals.lang],
          response: 400,
          data: {},
        });
      }
    }
  }
}

module.exports = error_handler;
