const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    orgName: {
      type: String,
      required: true,
    },

    recipientEmail: {
      type: String,
      required: true,
    },

    certificateName: { // ⬅ UPDATED HERE
      type: String,
      required: true,
    },

    fields: {
      type: Object,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },

    signature: {
      type: String,
      required: true,
    },

    issuedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    blockchainTxId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", CertificateSchema);
