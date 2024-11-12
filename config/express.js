require("dotenv").config();
const express = require("express"),
  path = require("path"),
  validUrl = require("valid-url"),
  winston = require("./winston"),
  log = require("morgan"),
  cookieParser = require("cookie-parser"),
  http = require("http"),
  bodyParser = require("body-parser"),
  expressValidator = require("express-validator"),
  _ = require("lodash"),
  cors = require("cors"),
  customValidators = require("./custom_validators.js"),
  commonLib = require("../app/modules/globals/global.library"),
  errors_handler = require("./errors_handler");
const app = express();
// view engine setup
app.set("views", path.join(__dirname, "../app/views"));
app.use(log("dev"));
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "upload")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/upload', express.static('upload'));
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      return {
        param: param,
        message: msg,
        value: value,
      };
    },
    customValidators: customValidators,
  })
);

require("./config")((err) => {
  if (err) {
    winston.error(err);
  } else {
    // Normalize a port into a number, string, or false.
    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }
    // Event listener for HTTP server "error" event.
    function onError(error) {
      if (error.syscall !== "listen") {
        throw error;
      }

      var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    }
    function onListening() {
      var addr = server.address();
      var bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        winston.info(`\x1b[32mServer is listening on ${bind}\x1b[0m`);
    }

    // Create HTTP server.
    var server = http.createServer(app);
    // require("./socket_handler")(server);
    var port = normalizePort(process.env.PORT || "3000");
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
    var origin = "*";

    // CORS middleware
    app.use(cors());
    const allowCrossDomain = (req, res, next) => {
      var allowedOrigins = ["http://localhost:3001", "http://localhost:3000"];

      origin = req.headers.origin;
      if (allowedOrigins.indexOf(origin) > -1) {
        origin = req.headers.origin;
      } else {
        origin = "*";
      }
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,PATCH,POST,DELETE,OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Credentials", true);
      next();
    };

    app.use(allowCrossDomain);
    app.use((req, res, next) => {
      if (req.method === "OPTIONS") {
        console.log("!OPTIONS");
        var headers = {};
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Methods"] =
          "POST, GET, PUT, PATCH, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Allow-Headers"] = "Content-Type";
        res.writeHead(200, headers);
        res.end();
      } else {
        return next();
      }
    });
    app.use(cookieParser());

    require("./routes")(app);
    app.use((req, res, next) => {
      var err = new Error("Not Found");
      err.status = 404;
      next(err);
    });
    app.use(errors_handler);
  }
});

app.get("/testing", (req, res) => {
  res.send({
    status: "Working",
  });
});

module.exports = app;
