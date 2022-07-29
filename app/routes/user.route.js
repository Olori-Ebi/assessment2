const express = require('express');
const UserController = require('../controllers/user.controller');
const { validateSignup, validateSignin } = require('../middleware/request');

const userRouter = express.Router();

userRouter.route("/user/signup").post(validateSignup, UserController.signup);
userRouter.route("/user/signin").post(validateSignin, UserController.signin);

module.exports = userRouter;