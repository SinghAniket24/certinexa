const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// 1. Load the ABI
const abiPath = path.join(__dirname, "../abis/CertificateRegistry.json");
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const abi = contractJson.abi;

// 2. Setup Provider and Wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 3. Create Contract Instance
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// 4. Helper Function: Store Certificate
const storeCertificateOnChain = async (certId, hash, signature) => {
    try {
        console.log(`🔗 Blockchain: Storing certificate ${certId}...`);
        
        // Send transaction
        const tx = await contract.storeCertificate(certId, hash, signature);
        console.log(`⏳ Transaction sent: ${tx.hash}`);
        
        // Wait for it to be mined
        await tx.wait();
        console.log(`✅ Transaction confirmed on block.`);
        
        return tx.hash;
    } catch (error) {
        console.error("❌ Blockchain Error:", error.message);
        throw new Error("Blockchain storage failed: " + error.message);
    }
};

// 5. Helper Function: Verify Certificate
const verifyCertificateOnChain = async (certId) => {
    try {
        const result = await contract.getCertificate(certId);
        // Result is an array: [hash, signature, timestamp]
        return {
            hash: result[0],
            signature: result[1],
            timestamp: result[2].toString() // Convert BigInt to string
        };
    } catch (error) {
        console.error("❌ Blockchain Verification Error:", error.message);
        return null; // Certificate not found
    }
};

module.exports = { storeCertificateOnChain, verifyCertificateOnChain };