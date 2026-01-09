const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Organization = require("../models/organization/organization");
const OrgKey = require("../digitalSignature/keyModel");
const Certificate = require("../models/certificate/certificate");

// 📧 Mailer import (From Branch 2)
const { sendCertificateMail } = require("../utils/mailer");

// Blockchain Helper
const { storeCertificateOnChain } = require("../config/blockchain");

// ---------- Simple Org Auth Middleware ----------
function authOrg(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.orgAuth = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ---------- Generate Certificate ID ----------
function generateCertificateId(orgName) {
  const cleaned =
    (orgName || "ORG").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 3) || "ORG";

  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${cleaned}-${randomPart}`;
}

// ---------- Private Key Decryptor ----------
function decryptPrivateKey(encryptedPrivateKey) {
  const parts = encryptedPrivateKey.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted private key format");

  const [ivHex, tagHex, cipherHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const cipherText = Buffer.from(cipherHex, "hex");

  const secret = process.env.PRIVATE_KEY_SECRET;
  if (!secret) throw new Error("PRIVATE_KEY_SECRET is not set");

  const key = Buffer.from(secret);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return decrypted.toString("utf8");
}

// ---------- POST /certificate/issue ----------
router.post("/issue", authOrg, async (req, res) => {
  try {
    const { templateName, email, fields } = req.body;

    if (!templateName || !email || !fields) {
      return res.status(400).json({ message: "templateName, email and fields are required" });
    }

    const org = await Organization.findById(req.orgAuth.id);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    const orgKeys = await OrgKey.findOne({ orgId: org._id });
    if (!orgKeys)
      return res.status(404).json({ message: "Keys not found for this organization" });

    const privateKeyPem = decryptPrivateKey(orgKeys.privateKey);

    const issuedAt = new Date();
    const certificateId = generateCertificateId(org.organizationName);

    const certificateData = {
      certificateId,
      orgId: org._id,
      orgName: org.organizationName,
      certificateName: templateName,
      recipientEmail: email,
      fields,
      issuedAt,
    };

    const certificateJson = JSON.stringify(certificateData);

    const hashBuffer = crypto.createHash("sha256").update(certificateJson).digest();
    const hashHex = hashBuffer.toString("hex");

    const signatureBuffer = crypto.sign(null, hashBuffer, {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
    });

    const signatureBase64 = signatureBuffer.toString("base64");

    // Debug Logs (From Branch 1 - kept for visibility)
    console.log("======================================================");
    console.log("📜 New Certificate Issued:");
    console.log("➡ Certificate Data:", certificateData);
    console.log("🔐 Hash:", hashHex);
    console.log("✍️ Signature:", signatureBase64.substring(0, 60) + "...");
    console.log("======================================================");

    // 🚀 Blockchain Storage
    console.log("⛓️ Sending certificate to blockchain...");
    const txHash = await storeCertificateOnChain(
      certificateId,
      "0x" + hashHex,
      signatureBase64
    );
    console.log("⛓️ Blockchain Tx Hash:", txHash);

    // 🛠 Save in MongoDB
    await Certificate.create({
      ...certificateData,
      hash: hashHex,
      signature: signatureBase64,
      blockchainTxId: txHash,
    });

    console.log("🗄️ Certificate saved in MongoDB!");

    // 📧 SEND EMAIL TO RECIPIENT 
    try {
      await sendCertificateMail({
        to: email,
        certificateId,
        certificateName: templateName,
        issuer: org.organizationName,
        issuedAt,
      });
      console.log("📧 Certificate email sent to recipient");
    } catch (mailErr) {
      console.error("📧 Email sending failed:", mailErr.message);
    }

    return res.status(200).json({
      message: "Certificate issued and stored successfully",
      certificate: certificateData,
      hash: hashHex,
      signature: signatureBase64,
      blockchainTxId: txHash,
    });

  } catch (err) {
    console.error("Error issuing certificate & storing:", err);
    return res.status(500).json({ message: "Server error while issuing certificate" });
  }
});


// ---------- GET /certificate/list (Org-based fetch) ----------
router.get("/list", authOrg, async (req, res) => {
  try {
    const certificates = await Certificate.find({ orgId: req.orgAuth.id })
      .sort({ issuedAt: -1 });

    return res.status(200).json({
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    console.error("Error fetching certificates:", err);
    return res.status(500).json({ message: "Server error while fetching certificates" });
  }
});

module.exports = router;