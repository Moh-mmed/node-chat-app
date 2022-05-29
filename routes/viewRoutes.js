const express = require('express');
// const chatController = require('./../controllers/chatController')
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('messages');
});

//? Authenticate the User
router.post('/api/auth-login', authController.login);
router.post('/api/auth-signup', authController.signup);
router.get('/api/auth-logout', authController.logout);

router.get('/messages', authController.protect, viewController.getChatHomepage);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);

module.exports = router;
