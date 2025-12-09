const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load ABI
const abiPath = path.join(__dirname, "../abis/CertificateRegistry.json");
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const abi = contractJson.abi;

// Provider + Signer
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract instance
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// ---------------- STORE CERTIFICATE ON CHAIN ----------------
const storeCertificateOnChain = async (certId, hash, signature) => {
  try {
    console.log(`🔗 Blockchain: Storing certificate ${certId}...`);

    const tx = await contract.storeCertificate(certId, hash, signature);
    console.log(`⏳ Tx sent: ${tx.hash}`);

    await tx.wait();
    console.log("✅ Tx confirmed!");

    return tx.hash;
  } catch (error) {
    console.error("❌ Blockchain Store Error:", error);
    throw new Error(error.message);
  }
};

// ---------------- VERIFY CERTIFICATE (GET) -------------------
const verifyCertificateOnChain = async (certId) => {
  try {
    const result = await contract.getCertificate(certId);

    const [hash, signature, timestamp] = result;

    // If hash is empty → not stored
    if (!hash || hash === "") {
      return { exists: false };
    }

    return {
      exists: true,
      hash,
      signature,
      timestamp: Number(timestamp) * 1000 // Convert to milliseconds
    };
  } catch (error) {
    console.error("❌ Blockchain Verification Error:", error.message);
    return { exists: false };
  }
};

module.exports = {
  storeCertificateOnChain,
  verifyCertificateOnChain
};
