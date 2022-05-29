const Conversation = require("../models/conversationModel");
const catchAsync = require("../utils/catchAsync");


exports.createConversation = catchAsync( async(req, res, next) => {
    const members = [req.body.senderId, req.body.receiverId];
    const conversation = await Conversation.create({ members });
    
    res.status(201).json({
      status: 'success',
      data: { conversation },
    });
})
exports.getAllConversations = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });

    res.status(200).json({
      status: 'success',
      data: { conversations },
    });
})
// exports.getConversation = catchAsync(async (req, res, next) => {
//     // const userId = req.user.id;
//     const userId = req.params.id
//     const conversations = await Conversation.find({
//       members: { $in: [userId] },
//     });
//     res.status(200).json({
//       status: 'success',
//       conversations,
//     });
// })