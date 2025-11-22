const mongoose = require("mongoose");

const recepientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    walletAddress: {
      type: String,
      default: null,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recepient", recepientSchema);
