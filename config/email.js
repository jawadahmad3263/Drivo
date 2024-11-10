const nodemailer = require("nodemailer");
const {
   ADMIN_EMAIL,
   ADMIN_APP_PASS,
} = require("./constants");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_APP_PASS
  }
  // tls: {
  //   rejectUnauthorized: false
  // }
});

async function sendEmail(toEmail, subject, content) {
    try {
        if (toEmail) {
            let info = transporter.sendMail({
              from: ADMIN_EMAIL,
              to: toEmail,
              subject: subject,
              html: content
            });
            return info;
          }
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        error: "An error occurred while sending the email."
      };
    }
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const sendEmailVerificationCode = async (userEmail, verificationCode) => {
    const subject = "Email Verification";
    const content =
      `<!DOCTYPE html>
  <html>
  <head>
      <title>Email Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
          }
          h1 {
              color: #4CAF50;
          }
          p {
              margin-bottom: 20px;
          }
          .code-container {
              border: 1px solid #ddd;
              padding: 10px;
              background-color: #fff;
              text-align: center;
              font-size: 1.5em;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Hello!</h1>
          <p>Welcome to Drivo! To complete your registration, please verify your email using the code below:</p>
          <div class="code-container">
              ${verificationCode}
          </div>
          <p>Enter this code in the verification field in your application to activate your account.</p>
          <p>If you didn’t sign up for this account, please ignore this email.</p>
          <p>Thank you for using Drivo Application!</p>
      </div>
  </body>
  </html>`;
  
    let result = await sendEmail(userEmail, subject, content);
    return result;
  };

  module.exports = {
    sendEmailVerificationCode
  }