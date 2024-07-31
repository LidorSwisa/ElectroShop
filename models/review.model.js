const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: Date, required: true },
  },
  { versionKey: false }
);

const Review = mongoose.model("reviews", ReviewSchema);

module.exports = Review;
