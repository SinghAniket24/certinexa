const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      default: "",
      trim: true,
    },
    organizationType: {
      type: String,
      required: true,
      trim: true,
    },
    customType: {
      type: String,
      default: "",
      trim: true,
    },
    officialEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    officialPhone: {
      type: String,
      required: true,
      trim: true,
    },
    walletAddress: {
      type: String,
      default: "",
      trim: true,
    },
    verificationDocument: {
      type: String,
      required: true,
      trim: true,
    },
    organizationAddress: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    verification_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verified_by: {
      type: String, // storing admin ID as string for now
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
