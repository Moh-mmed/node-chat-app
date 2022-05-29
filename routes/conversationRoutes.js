const router = require('express').Router()
const authController = require('../controllers/authController')
const conversationController = require('../controllers/conversationController')

router.use(authController.protect)
router.post('/', conversationController.createConversation )
router.get('/', conversationController.getAllConversations )

module.exports = router