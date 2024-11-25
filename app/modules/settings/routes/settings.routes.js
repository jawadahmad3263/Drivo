const settingsMiddleWare = require('../middlewares/settings.middleware')
const settingsController = require('../controller/settings.controller')
const {
    passport,
    authenticateMiddleware,
} = require('../../../../config/passport')
const config = require("../../../../config/config.json");
const resources = '/settings'

module.exports = (app) => {
   //update fare 
  app.put(
    resources + "/update-estimated-fare",
    authenticateMiddleware,
    passport.authorize([config.userTypes[0]]),//only admin
    settingsMiddleWare.validateEstimationId,
    settingsController.updateEstimationFare
  );
  app.get(
    resources + '/estimated-fare',
    authenticateMiddleware,
    settingsController.getAllEstimatedFares
)
}