const mongoose = require('mongoose');

const RecipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, default: null } // Optional at start
}, { timestamps: true });

module.exports = mongoose.model('Recipient', RecipientSchema);