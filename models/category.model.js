const mongoose = require("mongoose");

const CategoryScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  },
  { versionKey: false }
);

const Category = mongoose.model("categories", CategoryScheme);

module.exports = Category;
