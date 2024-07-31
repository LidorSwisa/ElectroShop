const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    description: { type: String, required: false, default: "" },
  },
  { versionKey: false }
);

const ProductScheme = new mongoose.Schema(
  {
    itemId: { type: String, required: false, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "categories" },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
      discount: { type: Number, required: false, default: 0 },
    },
    availability: { type: String, required: true },
    warranty: { type: String, required: true },
    tags: [{ type: String }],
    images: [ImageSchema],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],
  },
  { versionKey: false }
);

const Product = mongoose.model("products", ProductScheme);

module.exports = Product;
