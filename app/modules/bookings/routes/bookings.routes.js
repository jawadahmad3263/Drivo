const bookingsMiddleWare = require('../middlewares/bookings.middleware')
const bookingsController = require('../controller/bookings.controller')
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
    bookingsController.bookingResponse
  
  );
  //get single booking details
  app.get(
    resources,
    authenticateMiddleware,
    bookingsController.getSingleBooking,
    bookingsController.bookingResponse
  );
  //update booking
  app.put(
    resources,
    authenticateMiddleware,
    bookingsController.updateBooking,
    bookingsController.bookingResponse
  );
  //get all bookings list
  app.get(
    resources + "/all",
    authenticateMiddleware,
    bookingsController.getAllBookings
  );
}