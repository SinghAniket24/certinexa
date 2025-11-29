import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CertificateRegistryModule = buildModule("CertificateRegistryModule", (m) => {
  const certRegistry = m.contract("CertificateRegistry");
  return { certRegistry };
});

export default CertificateRegistryModule;