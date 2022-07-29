const helperUtils = require("../helper/index.js");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const { _id } = helperUtils.verifyToken(req.headers.authorization);

    req.user = _id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Unauthorized" });
  }
};
