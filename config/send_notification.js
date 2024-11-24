const admin = require("firebase-admin");
const account = require("../drivo--fyp-firebase-adminsdk-89rnn-e76ae6b21e.json");

admin.initializeApp({
  credential: admin.credential.cert(account),
});

const sendNotification = (registrationTokens, data) => {
  const tokens = Array.isArray(registrationTokens)
    ? registrationTokens
    : [registrationTokens];

  const validTokens = tokens.filter(
    (token) => typeof token === "string" && token.trim()
  );

  if (validTokens.length === 0) {
    console.log("No valid registration tokens provided.");
    return;
  }

  const messages = validTokens.map((token) => ({
    data: {
      createdAt: JSON.stringify(data.createdAt),
    },
    notification: {
      title: data.title,
      body: data.description,
    },
    token: token,
  }));

  try {
    Promise.allSettled(
      messages.map((message) => admin.messaging().send(message))
    )
      .then((responses) => {
        responses.forEach((response, index) => {
          if (response.status === "fulfilled") {
            console.log(
              `Notification sent successfully to token ${validTokens[index]}`
            );
          } else {
            console.log(
              `Failed to send notification to token ${validTokens[index]}`,
              response.reason
            );
          }
        });
      })
      .catch((error) => {
        console.log("Error", error);
        return error;
      });
  } catch (error) {
    console.error("Unexpected error occurred", error);
  }
};

module.exports = {
  sendNotification,
};
