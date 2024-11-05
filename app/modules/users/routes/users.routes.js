const userMiddleWare = require('../middlewares/users.middleware')
const userController = require('../controller/users.controller')
const {
    passport,
    authenticateMiddleware,
} = require('../../../../config/passport')

const commonLib = require('../../globals/global.library')

const resources = '/accounts'

module.exports = (app) => {
    // Register user API
    app.post(
        resources + '/signup',
        userMiddleWare.validateSignupParams,
        userController.signup,
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
    
    app.post("/logout", authenticateMiddleware, userController.logout);
}