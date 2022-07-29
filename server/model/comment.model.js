const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  comments: [
    {
      _id: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
      replies: [
        {
          _id: { type: String, required: true },
          user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
          text: { type: String, required: true },
          date: { type: Date, default: Date.now }
        },
      ],
    },
  ],
});

const Comment = mongoose.model("Comments", commentSchema);
module.exports = Comment;
