const bookingsMiddleWare = require('../middlewares/bookings.middleware')
const bookingsController = require('../controller/bookings.controller')
const notificationController = require("../../notifications/controller/notifications.controller")
const {
    passport,
    authenticateMiddleware,
} = require('../../../../config/passport')
const config = require("../../../../config/config.json");
const resources = '/booking'

module.exports = (app) => {
   //add booking  
  app.post(
    resources,
    authenticateMiddleware,
    passport.authorize([config.userTypes[1]]),
    bookingsMiddleWare.validatebookingParams,
    bookingsController.addBooking,
    notificationController.newBookingNotification,
    bookingsController.bookingResponse
  
  );
  //get single booking details
  app.get(
    resources,
    authenticateMiddleware,
    bookingsController.getSingleBooking,
    bookingsController.bookingResponse
  );
  //update booking status
  app.put(
    resources,
    authenticateMiddleware,
    bookingsController.updateBookingStatus,
    notificationController.commonNotification,
    bookingsController.bookingResponse
  );
  //get all bookings list
  app.get(
    resources + "/all",
    authenticateMiddleware,
    bookingsController.getAllBookings
  );
  app.post(
    resources + "/pool/request",
    authenticateMiddleware,
    passport.authorize([config.userTypes[1]]),
    bookingsMiddleWare.validatebookingId,
    bookingsController.addPoolMember,
    notificationController.commonNotification,
    bookingsController.commonResponse
  );
  app.put(
    resources + "/pool/accept-reject-member-req",
    authenticateMiddleware,
    passport.authorize([config.userTypes[1]]),
    bookingsMiddleWare.validatePoolAcceptRejectParams,
    bookingsController.acceptRejectPoolMember,
    notificationController.commonNotification,
    bookingsController.commonResponse
  );
  app.post(
    resources + "/rider-request",
    authenticateMiddleware,
    passport.authorize([config.userTypes[2]]),
    bookingsMiddleWare.validatebookingId,
    bookingsController.addRiderRequest,
    notificationController.commonNotification,
    bookingsController.commonResponse
  );
  app.get(
    resources + "/all-rider-request",
    authenticateMiddleware,
    passport.authorize([config.userTypes[1]]),
    bookingsMiddleWare.validatebookingId,
    bookingsController.allRiderRequest
  );
  app.put(
    resources + "/accept-rider-request",
    authenticateMiddleware,
    passport.authorize([config.userTypes[1]]),
    bookingsMiddleWare.validateRiderReqId,
    bookingsController.acceptRiderRequest,
    notificationController.commonNotification,
    bookingsController.getSingleBooking,
    bookingsController.bookingResponse
  );
  app.get(
    resources + "/search-pool-list",
    authenticateMiddleware,
    bookingsController.getPoolList
  );
}