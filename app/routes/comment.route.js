const express = require('express');
const CommentController = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateCommentReply, validateComment } = require('../middleware/request');

const commentRouter = express.Router();

commentRouter
  .route("/comment/:productId")
  .post(authMiddleware, validateComment, CommentController.postComment);

commentRouter
  .route("/comment/:productId/:commentId/reply")
  .post(authMiddleware, validateCommentReply, CommentController.replyComment);

commentRouter
  .route("/comments/:productId")
  .get(authMiddleware, CommentController.getComments);

module.exports = commentRouter;