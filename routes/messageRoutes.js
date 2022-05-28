const router = require('express').Router();
const authController = require('../controllers/authController');
const messagesController = require('../controllers/messagesController');

router.use(authController.protect);
router.post('/', messagesController.createMessage);
router.get('/:id', messagesController.getAllMessages);

module.exports = router;
