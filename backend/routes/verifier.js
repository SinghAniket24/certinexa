const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const Certificate = require("../models/certificate/certificate");
const { verifyCertificateOnChain } = require("../config/blockchain");

// 🔍 GET /verify/:certificateId
router.get("/:certificateId", async (req, res) => {
  try {
    const { certificateId } = req.params;

    const cert = await Certificate.findOne({ certificateId });

    if (!cert) {
      return res.json({
        valid: false,
        message: "Certificate not found ❌",
      });
    }

    // Step 1: Recreate original certificate JSON for hashing
    const certificateData = {
      certificateId: cert.certificateId,
      orgId: cert.orgId,
      orgName: cert.orgName,
      certificateName: cert.certificateName,
      recipientEmail: cert.recipientEmail,
      fields: cert.fields,
      issuedAt: cert.issuedAt,
    };

    const calculatedHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(certificateData))
      .digest("hex");

    // Check tampering
    if (calculatedHash !== cert.hash) {
      return res.json({
        valid: false,
        message: "❌ Hash mismatch — Certificate data modified",
      });
    }

    // Step 2: Check blockchain stored data 🔗
    const onChain = await verifyCertificateOnChain(cert.certificateId);

    if (!onChain.exists || onChain.hash !== "0x" + calculatedHash) {
      return res.json({
        valid: false,
        message: "⚠ Certificate hash does not match on-chain record",
      });
    }

return res.json({
  valid: true,
  message: "Certificate is VALID ✔",
  certificateId: cert.certificateId,
  certificateName: cert.certificateName,
  issuer: cert.orgName,
  recipientEmail: cert.recipientEmail,
  fields: cert.fields,
  issuedOn: cert.issuedAt,
  blockchainTxId: cert.blockchainTxId,
  hash: cert.hash,
});


  } catch (err) {
    console.error("Verification Error:", err);
    return res.json({
      valid: false,
      message: "Server Error ❌",
    });
  }
});

module.exports = router;