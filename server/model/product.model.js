const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    price: {
      type: String,
      trim: true,
    },
    long: Number,
    lat: Number,
    radius: Number,
    address: String,
    image: {
      type: String,
      trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
    }],
  },
  { timestamps: true }
);

const Product = mongoose.model('Products', ProductSchema);

module.exports = Product;