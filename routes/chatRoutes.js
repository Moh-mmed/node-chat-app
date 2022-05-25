const express = require('express')
// const chatController = require('./../controllers/chatController')
const authController = require('./../controllers/authController')
const viewController = require('./../controllers/viewController')

const router = express.Router();


//? Authenticate the User
router.post('/auth-login', authController.login)
router.post("/auth-signup", authController.signup);
router.get('/auth-logout', authController.logout)

router.get("/", (req, res) => {
    res.redirect('messages')
});
router.get("/messages", viewController.getChatHomepage);
router.get("/login", viewController.getLoginForm);
router.get("/signup", viewController.getSignupForm);

module.exports = router