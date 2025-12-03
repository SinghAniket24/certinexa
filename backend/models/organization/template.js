const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    templateName: { type: String, required: true },
    fields: [
      {
        label: { type: String, required: true },
        type: { type: String, enum: ["text", "email", "date", "number"], required: true },
        required: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Template", templateSchema);
