const Comment = require("../model/comment.model");
const User = require("../model/user.model");
const uuid = require("uuid").v4;
const mailer = require("../helper/sendMail");
const { ObjectID } = require('mongodb');

const fromUser = process.env.FROM;

class CommentController {
  static async postComment(req, res) {
    const { productId } = req.params;
    const newObjectId = new ObjectID();
    if (req.body.text.length < 1) {
      return res
        .status(400)
        .json({ msg: "Comment must be atleast 1 character long" });
    }
    try {
      let product = await Comment.findOne({ product: productId });
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      const comment = {
        _id: newObjectId.toString(),
        user: req.user,
        text: req.body.text,
        date: Date.now(),
        replies: [],
      };
      product.comments.unshift(comment);
      await product.save();
      product = await Comment.populate(product, "comments.user");
      product = await Comment.populate(product, "comments.replies.user");

      res.status(201).json(product.comments);
    } catch (error) {
      console.log(error);
    }
  }

  static async replyComment(req, res) {
    const newObjectId = new ObjectID();
    try {
      if (req.body.replyText.length < 1) {
        return res
          .status(400)
          .json({ msg: "Reply must be atleast 1 character long" });
      }
      const user = await User.findById(req.user);
      let product = await Comment.findOne({ product: req.params.productId });
      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }
      const reply = {
        _id: newObjectId.toString(),
        user: req.user,
        text: req.body.replyText,
        date: Date.now(),
      };

      const commentToReply = product.comments.find(
        (comment) => comment._id === req.params.commentId
      );
      commentToReply.replies.push(reply);
      await product.save();

      product = await Comment.populate(product, "comments.user");
      product = await Comment.populate(product, "comments.replies.user");
      
      //Compose an email
      const html = `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <p>${user.firstName} ${user.lastName} just replied to your comment: <small style="font-syle: italic;"> ${commentToReply.text} </small> </p>
        </div>
      `;
      // Send email
      await mailer.sendEmail(
        fromUser,
        commentToReply.user.email,
        "Reply Notification",
        html
      );

      res.status(201).json(product.comments);
    } catch (error) {
      console.log(error);
    }
  }

  static async getComments(req, res) {
    try {
      const product = await Comment.findOne({ product: req.params.productId })
        .populate("comments.user")
        .populate("comments.replies.user");

      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      res.status(200).json(product.comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  }
}

module.exports = CommentController;
