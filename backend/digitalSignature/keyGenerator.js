const crypto = require('crypto');
const OrgKeys = require('./keyModel');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.PRIVATE_KEY_SECRET; // 32 bytes
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error("PRIVATE_KEY_SECRET must be 32 characters long");
}

function encryptPrivateKey(privateKey) {
  const iv = crypto.randomBytes(12); // AES-GCM IV
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);

  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Store iv + authTag + encrypted together
  return iv.toString('hex') + ':' + authTag + ':' + encrypted;
}

async function generateOrgKeys(orgId) {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      "rsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
      },
      async (err, publicKey, privateKey) => {
        if (err) return reject(err);

        try {
          // Encrypt private key before storing
          const encryptedPrivateKey = encryptPrivateKey(privateKey);

          const saved = await OrgKeys.create({
            orgId,
            publicKey,
            privateKey: encryptedPrivateKey
          });

          resolve(saved);
        } catch (dbErr) {
          reject(dbErr);
        }
      }
    );
  });
}

module.exports = generateOrgKeys;
