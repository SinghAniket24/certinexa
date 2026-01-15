
const certiNexaKnowledge = `
CertiNexa – Blockchain Certificate System

CertiNexa is a blockchain-based digital certificate platform designed to issue, manage, and verify certificates in a secure, tamper-proof, and transparent manner. It replaces traditional paper or centralized digital certificates with blockchain-backed verification.

────────────────────────
What problem does CertiNexa solve?
────────────────────────
Traditional certificates can be:
- Forged or altered
- Lost or damaged
- Hard to verify across institutions
- Dependent on centralized authorities

CertiNexa solves this by storing certificate proofs on the blockchain, ensuring authenticity, immutability, and long-term trust.

────────────────────────
Who can use CertiNexa?
────────────────────────
CertiNexa supports four main user roles:

1. Admin
   - Manages organizations on the platform
   - Approves or verifies organizations
   - Oversees system-level operations

2. Organization (Issuer)
   - Creates certificate templates
   - Issues certificates (single or bulk)
   - Manages issued certificates
   - Views blockchain transaction details

3. Recipient
   - Receives certificates issued by organizations
   - Views and downloads certificates
   - Shares certificate IDs for verification

4. Verifier
   - Verifies certificate authenticity
   - Checks whether a certificate exists on the blockchain
   - Confirms that certificate data has not been tampered with

────────────────────────
How does CertiNexa work?
────────────────────────
1. An organization creates a certificate template.
2. Certificates are issued using the template.
3. Each certificate is digitally signed and hashed.
4. The hash and signature are stored on the blockchain.
5. The full certificate data is stored securely in the system database.
6. Anyone can verify a certificate using its unique Certificate ID.

────────────────────────
What makes CertiNexa secure?
────────────────────────
- Blockchain immutability prevents certificate tampering
- Each certificate has a unique ID
- Digital signatures ensure authenticity
- No certificate can be modified after issuance
- Verification does not require trusting the issuer manually

────────────────────────
Certificate Verification
────────────────────────
Verification confirms:
- Certificate exists on the blockchain
- Certificate ID is valid
- Certificate data matches the stored blockchain hash
- Certificate has not been altered

This ensures trust even years after issuance.

────────────────────────
System Architecture (High Level)
────────────────────────
CertiNexa is built as a modular system:

- Frontend: User-facing portals for Admin, Organization, Recipient, and Verifier
- Backend: Handles authentication, certificate management, and blockchain interaction
- Blockchain: Stores immutable certificate proofs using smart contracts

────────────────────────
Bulk Certificate Issuance
────────────────────────
Organizations can issue certificates in bulk using Excel files.
- A single template is selected
- Each row represents one recipient
- Certificates are issued automatically and securely
- Each certificate is individually recorded on the blockchain

────────────────────────
What CertiNexa does NOT do
────────────────────────
- It does not expose internal source code to users
- It does not allow editing certificates after issuance
- It does not store sensitive personal data on the blockchain
- It does not rely on centralized verification authorities

────────────────────────
Why blockchain is used
────────────────────────
Blockchain ensures:
- Trust without intermediaries
- Tamper-proof records
- Publicly verifiable authenticity
- Long-term availability

────────────────────────
Common questions visitors may ask
────────────────────────
- Is certificate verification free? → Yes
- Can certificates be forged? → No
- Can certificates be deleted? → No
- Can organizations issue fake certificates? → No, all issuance is traceable
- Is personal data stored on blockchain? → No, only cryptographic proofs

────────────────────────
CertiNexa Vision
────────────────────────
CertiNexa aims to become a trusted digital certification standard for:
- Educational institutions
- Training organizations
- Enterprises
- Online learning platforms

By combining usability with blockchain security, CertiNexa ensures trust, transparency, and permanence.
`;

module.exports = {
  certiNexaKnowledge
};
