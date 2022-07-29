const User = require("../model/user.model");
const helperUtils = require("../helper/index");

class UserController {
  static async signup(req, res) {
    const { firstName, lastName, email, password, address, lat, long } =
      req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be atleast 6 characters long" });
    }

    try {
      let user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        return res.status(409).json({ msg: "You are already registered" });
      }

      // Check if username is already taken
      user = await User.findOne({ email: email.toLowerCase() });
      console.log(user);
      if (user) {
        return res.status(400).json({ msg: "Email is already taken" });
      }

      let hashedPassword = helperUtils.hashPassword(password);
      user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        address,
        password: hashedPassword,
        lat,
        long,
      });

      await user.save();

      res.status(201).json({
        message: "Registration Successful!",
        user,
        token: helperUtils.generateToken({ _id: user._id, email: user.email }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async signin(req, res) {
    const { email, password } = req.body;

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be atleast 6 characters long" });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );

      if (user && helperUtils.comparePassword(password, user.password)) {
        return res.status(200).json({
          user,
          token: helperUtils.generateToken({ _id: user._id }),
        });
      }

      return res.status(403).json({
        msg: "Invalid credentials",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  }
}

module.exports = UserController;
