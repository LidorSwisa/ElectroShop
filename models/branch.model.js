const mongoose = require("mongoose");

const BranchScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: {
      name: { type: String, required: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { versionKey: false }
);

const Branch = mongoose.model("branches", BranchScheme);

module.exports = Branch;
