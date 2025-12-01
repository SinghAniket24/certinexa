
# CertiNexa - Blockchain Certificate System

CertiNexa is a decentralized application that allows organizations to issue, manage, and verify digital certificates on the blockchain. It provides a secure and tamper-proof way to store and share certificates, eliminating the need for traditional paper-based certificates.

## Project Structure

The project is divided into three main folders:

- `frontend`: Contains the React frontend application.
- `backend`: Contains the Node.js/Express backend server.
- `blockchain`: Contains the Solidity smart contract and Hardhat development environment.

### Frontend

The frontend is a React application that provides a user interface for interacting with the CertiNexa platform. It has different portals for different user roles:

- **Issuer Portal:** For organizations to issue and manage certificates.
- **Recipient Portal:** For users to view and manage their certificates.
- **Verifier Portal:** For anyone to verify the authenticity of a certificate.

#### File Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
└── src/
    ├── App.js
    ├── admin/
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminSignup.jsx
    │   └── styles/
    │       └── ...
    ├── organization/
    │   ├── login.js
    │   └── register.js
    ├── recepient/
    │   ├── login.jsx
    │   └── register.jsx
    └── verification/
        └── verifier.jsx
```

### Backend

The backend is a Node.js/Express server that provides a RESTful API for the frontend to interact with. It handles user authentication, certificate management, and communication with the blockchain.

#### File Structure

```
backend/
├── server.js
├── abis/
│   └── CertificateRegistry.json
├── config/
│   ├── blockchain.js
│   └── db.js
├── digitalSignature/
│   ├── keyGenerator.js
│   └── keyModel.js
├── models/
│   ├── admin/
│   │   └── admin.js
│   ├── certificate/
│   │   └── certificate.js
│   ├── organization/
│   │   └── organization.js
│   └── recepient/
│       └── recepient.js
└── routes/
    ├── adminRoutes.js
    ├── organization.js
    ├── organizationlogin.js
    ├── recepient.js
    └── recepientlogin.js
```

### Blockchain

The blockchain component consists of a Solidity smart contract that is deployed on an Ethereum-compatible blockchain. The smart contract, `CertificateRegistry.sol`, is responsible for storing and managing the certificates on the blockchain.

#### File Structure

```
blockchain/
├── contracts/
│   └── CertificateRegistry.sol
├── ignition/
│   └── modules/
│       └── CertificateRegistry.ts
└── test/
    └── CertificateRegistry.test.ts
```


### Prerequisites

- Node.js
- npm
- Hardhat
- MongoDB


## Backend API

The backend API provides the following routes:

- **Admin:**
    - `POST /api/admin/register`: Register a new admin.
    - `POST /api/admin/login`: Login an admin.
    - `GET /api/admin/organizations`: Get all organizations.
    - `PUT /api/admin/organization/:id/status`: Update the verification status of an organization.
- **Organization:**
    - `POST /api/organization/register`: Register a new organization.
    - `POST /api/organization/login`: Login an organization.
- **Recipient:**
    - `POST /api/recepient/register`: Register a new recipient.
    - `POST /api/recepient/login`: Login a recipient.

## Blockchain Smart Contract

The `CertificateRegistry` smart contract has the following functions:

- `storeCertificate(string memory _certificateId, string memory _certificateHash, string memory _signature)`: Stores a new certificate on the blockchain.
- `getCertificate(string memory _certificateId)`: Retrieves a certificate from the blockchain.
