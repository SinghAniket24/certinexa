const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  // 1. Links to Actors
  issuerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  recepientEmail: { type: String, required: true }, // Link even if user not reg'd
  recepientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Recipient',
    default: null 
  },

  // 2. Certificate Details
  cert_title: { type: String, required: true }, // e.g. "B.Sc. IT"
  cert_data: { type: Object, required: true }, // JSON: { "uid": "...", "grade": "..." }
  certificateID_readable: { type: String, unique: true }, // e.g. "CN-2025-001"
  
  issuedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date }, // Optional

  // 3. Blockchain Data
  certificateHash: { type: String, required: true, unique: true }, // The SHA-256 Hash
  txHash: { type: String }, // The Transaction Receipt
  status: { 
    type: String, 
    enum: ['Pending', 'Minted', 'Revoked'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);