const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
        },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    text: {
        type: String
    }
  },
  {
    timestamps: true,
  }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sender',
    select: '-__v -email',
  });
  next();
});
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
