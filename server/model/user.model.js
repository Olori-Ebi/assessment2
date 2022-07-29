const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter a valid email",
      },
    },
    address: {
      type: String,
      trim: true,
    },
    lat: Number,
    long: Number,
    mobile: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);

module.exports = User;
