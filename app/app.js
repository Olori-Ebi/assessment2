const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.route.js");
const { connectDB } = require("./model/connection.js");
const productRouter = require("./routes/product.route.js");
const commentRouter = require("./routes/comment.route.js");
const cors = require('cors')
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//Init BodyParser Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", userRouter, productRouter,commentRouter);

connectDB();

app.get("/", (_req, res) => {
  res.status(200).json({
    status: 200,
    msg: "Congratulations on finding your way around your first endpoint!!!!",
  });
});

app.listen(port, () => {
  console.log(`server started at ${port}`);
});

module.exports = app;
