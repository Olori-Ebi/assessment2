const db = require("../config/config");
const cloudinary = require("../helper/cloudinary");
const { getDistanceFromLatLonInKm } = require("../helper/util");
const Comment = require("../model/comment.model");
const Product = require("../model/product.model");
const User = require("../model/user.model");

class ProductController {
  static async createProduct(req, res) {
    try {
      const { name, price, address, lat, long, radius } = req.body;
      const image = await cloudinary.uploader.upload(req.file?.path);
      const product = new Product({
        name,
        price,
        address,
        lat,
        long,
        radius,
        image: image.secure_url,
        user: req.user,
      });
      await product.save();
      await new Comment({ product: product._id, comments: [] }).save();
      await db.collection("products").doc(product._id.toString()).set({
        name,
        price,
        address,
        lat,
        long,
        radius,
        image: image.secure_url,
        user: req.user,
      });

      return res.status(201).json({
        message: "Product saved successfully",
        product,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async getProducts(req, res) {
    try {
      let { radius } = req.query;
      if (!radius) radius = 0;
      const { user: userId } = req;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const products = await Product.find().populate({path:'comments',populate:{path:'comments.user'} }).populate("user");
      const filteredProductsByRadius = products.filter((product) => {
        const getDistanceByLatLong = getDistanceFromLatLonInKm(
          user.lat,
          user.long,
          product.lat,
          product.long
        );
        if ((getDistanceByLatLong <= product.radius + +radius) || (product.user.id === userId)) {
          console.log('user Distance', getDistanceByLatLong);
          console.log('product Distance', product.radius + +radius);
            return product;
        }
      });
      return res.status(200).json({ products: filteredProductsByRadius });
    } catch (error) {
      console.log(error);
    }
  }

  static async getProduct(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId)

      res.status(200).json({ message: "successful", product });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occured", error: error.message });
    }
  }
}

module.exports = ProductController;
