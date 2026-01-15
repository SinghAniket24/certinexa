//npm install xlsx multer

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const xlsx = require("xlsx");

const Organization = require("../models/organization/organization");
const OrgKey = require("../digitalSignature/keyModel");
const Certificate = require("../models/certificate/certificate");
const { storeCertificateOnChain } = require("../config/blockchain");

// ================= AUTH MIDDLEWARE =================
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
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ================= HELPERS =================
function generateCertificateId(orgName) {
  const cleaned =
    (orgName || "ORG")
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 3) || "ORG";

  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${cleaned}-${randomPart}`;
}

function decryptPrivateKey(encryptedPrivateKey) {
  const [ivHex, tagHex, cipherHex] = encryptedPrivateKey.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const cipherText = Buffer.from(cipherHex, "hex");

  const key = Buffer.from(process.env.PRIVATE_KEY_SECRET);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

// ================= MULTER CONFIG =================
const upload = multer({ dest: "uploads/" });

// ================= BULK ISSUE ROUTE =================


router.post(
  "/bulk-issue",
  authOrg,
  upload.single("file"),
  async (req, res) => {
    const { templateName } = req.body;

    if (!templateName || !req.file) {
      return res.status(400).json({
        message: "templateName and Excel file are required",
      });
    }

    try {
      const org = await Organization.findById(req.orgAuth.id);
      if (!org) return res.status(404).json({ message: "Organization not found" });

      const orgKeys = await OrgKey.findOne({ orgId: org._id });
      if (!orgKeys)
        return res.status(404).json({ message: "Keys not found for organization" });

      const privateKeyPem = decryptPrivateKey(orgKeys.privateKey);

      // ---- Read Excel File ----
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = xlsx.utils.sheet_to_json(sheet);

      let issued = 0;
      let failed = 0;

      for (const row of rows) {
        try {
          const email = row["Email"];
          if (!email) {
            failed++;
            continue;
          }

          const { Email, ...fields } = row;

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

          const hashBuffer = crypto
            .createHash("sha256")
            .update(certificateJson)
            .digest();

          const hashHex = hashBuffer.toString("hex");

          const signatureBuffer = crypto.sign(null, hashBuffer, {
            key: privateKeyPem,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
          });

          const signatureBase64 = signatureBuffer.toString("base64");

          const txHash = await storeCertificateOnChain(
            certificateId,
            "0x" + hashHex,
            signatureBase64
          );

          await Certificate.create({
            ...certificateData,
            hash: hashHex,
            signature: signatureBase64,
            blockchainTxId: txHash,
          });

          issued++;
        } catch (err) {
          console.error("Bulk issue error:", err.message);
          failed++;
        }
      }

      // Cleanup uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(200).json({
        message: "Bulk issuance completed",
        templateName,
        total: rows.length,
        issued,
        failed,
      });
    } catch (err) {
      console.error("Bulk issuance failed:", err);
      return res.status(500).json({
        message: "Server error during bulk issuance",
      });
    }
  }
);

module.exports = router;
