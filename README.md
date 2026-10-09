# CertiNexa – Blockchain Certificate System

CertiNexa is a decentralized application for issuing, managing and verifying digital certificates. Each certificate is hashed, digitally signed by the issuing organization and recorded on an Ethereum-compatible blockchain, making it tamper-proof and instantly verifiable by anyone.

**Live demo:** [certinexa.vercel.app](https://certinexa.vercel.app)

## How It Works

1. An organization registers and is approved by an admin, which generates its RSA signing keys.
2. The organization issues a certificate (single or bulk) from a template.
3. The backend computes a SHA-256 hash of the certificate, signs it with the organization's private key and stores the hash and signature on-chain via the `CertificateRegistry` smart contract.
4. The full certificate is saved in MongoDB and the recipient can view it in their portal.
5. Anyone can verify a certificate by its ID. The system recomputes the hash and compares it with the on-chain record.

## Features

- **Four role-based portals:** Admin, Organization, Recipient and Verifier
- **Organization approval workflow** with email notifications
- **Custom certificate templates** and **bulk issuing** from CSV/Excel files
- **On-chain verification** to detect tampered or forged certificates
- **Digital signatures:** per-organization RSA keys, with private keys encrypted (AES-256-GCM) at rest
- **AI chatbot** (Gemini) that answers questions about the platform
- **Rate limiting** on authentication and chatbot endpoints

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, React Router |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, ethers.js |
| Blockchain | Solidity, Hardhat, Hardhat Ignition |

## Project Structure

- `frontend/`: React application with the four portals
- `backend/`: Express REST API, authentication, signing and blockchain integration
- `blockchain/`: `CertificateRegistry` smart contract, tests and deployment module

## Getting Started

**Prerequisites:** Node.js v18+, npm and a running MongoDB instance.

**1. Clone and install**

```bash
git clone https://github.com/SinghAniket24/certinexa.git
cd certinexa
(cd blockchain && npm install)
(cd backend && npm install)
(cd frontend && npm install)
```

**2. Start a local blockchain and deploy the contract**

```bash
cd blockchain
npx hardhat node                      # terminal 1 (keep running)
npx hardhat ignition deploy ignition/modules/CertificateRegistry.ts --network localhost   # terminal 2
```

Copy the deployed contract address from the output.

**3. Configure the backend**

Create `backend/.env`:

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `PORT` | API port (default `5000`) |
| `JWT_SECRET` | Secret used to sign login tokens |
| `PRIVATE_KEY_SECRET` | Exactly 32 characters, used to encrypt organization signing keys |
| `RPC_URL` | Blockchain RPC endpoint (`http://127.0.0.1:8545` for local) |
| `PRIVATE_KEY` | Wallet private key used to send transactions (use an account printed by `hardhat node`) |
| `CONTRACT_ADDRESS` | Address of the deployed `CertificateRegistry` contract |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP credentials for notification emails |
| `GEMINI_API_KEY` | API key for the chatbot |

**4. Run the app**

```bash
cd backend && node server.js    # http://localhost:5000
cd frontend && npm start        # http://localhost:3000
```

## Smart Contract

`CertificateRegistry.sol` exposes two functions:

- `storeCertificate(certificateId, certificateHash, signature)`: records a certificate (rejects duplicate IDs)
- `getCertificate(certificateId)`: returns the stored hash, signature and timestamp

Run the contract tests with `npx hardhat test` inside `blockchain/`.
