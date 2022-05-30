const Message = require('../models/messageModel');
const catchAsync = require('../utils/catchAsync');

exports.createMessage = catchAsync(async (req, res, next) => {
  const message = await Message.create(req.body);
    Message.populate(message, { path: "sender", select: "-__v -email"}).then((sender) => {
       res.status(201).json({
         status: "success",
         data: { message },
       });
    });
});



exports.getAllMessages = catchAsync(async (req, res, next) => {
  const userId = req.user.id
  const messages = await Message.find({
    conversationId: req.params.id,
  });
  
  res.status(200).json({
    status: 'success',
      data: { messages, userId},
  });
});

// exports.getMessage = catchAsync(async (req, res, next) => {
//     // const userId = req.user.id;
//     const userId = req.params.id
//     const messages = await Message.find({
//       members: { $in: [userId] },
//     });
//     res.status(200).json({
//       status: 'success',
//       messages,
//     });
// })
