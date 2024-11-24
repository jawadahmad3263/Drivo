const config = require('../../../../../config/config.json');
const commonLib = require('../../../globals/global.library');
const {BASE_URL} = require("../../../../../config/constants");

let generateNotificationResponse = (notification) => {
    return {
      id: notification._id,
      title: notification?.title,
      description: notification?.description,
      notification_by: notification?.notification_by,
      notification_for: notification?.notification_for,
      booking_id: notification?.booking_id,
      read: notification?.read,
      readAt: notification.readAt,
      deletedAt: notification?.deletedAt,
      createdAt: notification?.createdAt
    };
  };

  module.exports = {
    generateNotificationResponse
  }