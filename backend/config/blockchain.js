const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/* =========================
   LOAD ABI
========================= */
const abiPath = path.join(__dirname, "../abis/CertificateRegistry.json");
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const abi = contractJson.abi;

/* =========================
   PROVIDER & WALLET
========================= */
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

/* =========================
   CONTRACT INSTANCE
========================= */
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  wallet
);

/* =========================
   STORE CERTIFICATE
========================= */
const storeCertificateOnChain = async (certId, hash, signature) => {
  try {
    console.log(`Blockchain: Storing certificate ${certId}`);

    const tx = await contract.storeCertificate(certId, hash, signature);
    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error("Blockchain storage error:", error.message);
    throw new Error("Blockchain storage failed");
  }
};

/* =========================
   VERIFY CERTIFICATE
========================= */
const verifyCertificateOnChain = async (certId) => {
  try {
    const result = await contract.getCertificate(certId);

    // If contract returns empty hash, certificate does not exist
    if (!result || result[0] === ethers.ZeroHash) {
      return { exists: false };
    }

    return {
      exists: true,
      hash: result[0],
      signature: result[1],
      timestamp: result[2].toString(),
    };
  } catch (error) {
    console.error("Blockchain verification error:", error.message);
    return { exists: false };
  }
};

module.exports = {
  storeCertificateOnChain,
  verifyCertificateOnChain,
};
