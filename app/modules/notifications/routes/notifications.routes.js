const notificationMiddleware = require('../middlewares/notifications.middleware')
const notificationsController = require('../controller/notifications.controller')
const {
    passport,
    authenticateMiddleware,
} = require('../../../../config/passport')
const config = require("../../../../config/config.json");
const resources = '/notification'

module.exports = (app) => {
    app.get(
        resources + `/all`,
        authenticateMiddleware,
        notificationsController.getAllNotification
      );
    
      //get unread notification count
      app.get(
        resources + "/unread-count",
        authenticateMiddleware,
        notificationsController.getUnreadCount
      );
    
      //api to soft delete notification
      app.put(
        resources + "/clear",
        authenticateMiddleware,
        notificationMiddleware.validateNotificationId,
        notificationsController.clearNotification
      );
    //api for notification to update read status to true
      app.put(
        resources + "/read",
        authenticateMiddleware,
        notificationMiddleware.validateNotificationId,
        notificationsController.readNotification
      );
}