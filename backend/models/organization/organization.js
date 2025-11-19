const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: true }, // The address verifying certs
  industryType: { type: String, required: true }, // e.g., "Education"
  
  // Verification Details
  documents: [{ type: String }], // Array of URL strings to uploaded files
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  rejectionReason: { type: String }, // Populated only if Rejected
  isVerified: { type: Boolean, default: false }, // Helper flag
  
  verifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);