const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  walletAddress: { type: String, required: true }, // Must be Contract Owner
  role: { 
    type: String, 
    enum: ['SuperAdmin', 'Support'], 
    default: 'SuperAdmin' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);