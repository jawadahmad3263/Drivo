const userMiddleWare = require('../middlewares/users.middleware')
const userController = require('../controller/users.controller')
const {
    passport,
    authenticateMiddleware,
} = require('../../../../config/passport')

const resources = '/accounts'

module.exports = (app) => {
    // Register user API
    app.post(
        resources + '/signup',
        userMiddleWare.validateSignupParams,
        userController.signup,
        userController.createLoginObject,
        userController.loginResponse,
    )

    app.post(
        resources + '/login',
        userMiddleWare.validateLoginParams,
        userController.login,
        userController.createLoginObject,
        userController.loginResponse,
    )

    app.post(
        resources + '/refresh-token',
        userMiddleWare.validateRefreshUserTokenParams,
        userController.refreshUserToken,
        userController.loginResponse,
    )

    app.get(
        resources + "/get-me",
        authenticateMiddleware,
        userController.getMe,
        userController.getUserSuccessResponse
      );
    
    app.post(resources + "/logout", authenticateMiddleware, userController.logout);

    app.get(
        resources + "/all",
        authenticateMiddleware,
        userController.getAllUsers
      );

    app.post(
        resources + "/delete",
        authenticateMiddleware,
        userController.deleteAccount
      );

    app.post(
        resources + "/verify-email",
        authenticateMiddleware,
        userController.verifyEmail
      );

    app.post(
        resources + "/change-password",
        authenticateMiddleware,
        userController.maskedPassword,
        userController.changePassword
      ); 
}