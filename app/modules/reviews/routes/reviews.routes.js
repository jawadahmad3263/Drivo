const reviewsMiddleWare = require('../middlewares/reviews.middlewares')
const reviewsController = require('../controller/review.controller')
const {
    passport,
    authenticateMiddleware,
} = require('../../../../config/passport')
const config = require("../../../../config/config.json");
const resources = '/reviews'

module.exports = (app) => {
     
  app.post(
    resources,
    authenticateMiddleware,
    reviewsMiddleWare.validateAddReviewParams,
    reviewsController.addNewReview,
    reviewsController.updateOverAllRatings,
    // notificationController.userReviewedNotification,
    reviewsController.reviewResponse
  );
  app.get(
    resources,
    authenticateMiddleware,
    reviewsMiddleWare.validateReviewIdParams,
    reviewsController.getsingleReviewDetail,
    reviewsController.reviewResponse
  );

  app.put(
    resources,
    authenticateMiddleware,
    reviewsController.updateReview
  );

  app.get(
    resources + "/all",
    authenticateMiddleware,
    reviewsController.getAllReviews
  );
}