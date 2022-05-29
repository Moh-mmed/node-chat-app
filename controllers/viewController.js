const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const catchAsync = require('../utils/catchAsync');

exports.getChatHomepage = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const conversations = await Conversation.find({
    members: { $in: [userId] },
  });
  const firstConversationId = conversations[0].id

  const firstConversation = await Message.find({
    conversationId: firstConversationId,
  });

  
  // res.status(200).json({
  //   title: 'Messages',
  //   conversations,
  //   firstConversation,
  // });
  res.status(200).render('messages', {
    title: 'Messages',
    conversations,
    firstConversation});
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up for new account',
  });
};
