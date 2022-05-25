const express = require('express')
// const chatController = require('./../controllers/chatController')
// const authController = require('./../controllers/authController')
const viewController = require('./../controllers/viewController')

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect('messages')
});
router.get("/messages", viewController.getChatHomepage);
router.get("/login", viewController.getLoginForm);
router.get("/signup", viewController.getSignupForm);

module.exports = router