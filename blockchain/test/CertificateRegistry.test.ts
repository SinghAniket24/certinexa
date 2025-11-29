import { expect } from "chai";
import { ethers } from "hardhat";

describe("Certinexa Registry", function () {
  it("Should store and retrieve certificate data", async function () {
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    const certRegistry = await CertificateRegistry.deploy();

    const certId = "CERT-TEST-001";
    const mockHash = "0x123abc";
    const mockSig = "0xsignature";

    await certRegistry.storeCertificate(certId, mockHash, mockSig);
    const [storedHash, storedSig] = await certRegistry.getCertificate(certId);

    expect(storedHash).to.equal(mockHash);
    expect(storedSig).to.equal(mockSig);
    console.log("✅ Test Passed: Data verified on-chain.");
  });
});