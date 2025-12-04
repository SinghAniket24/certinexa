# CertiNexa - Blockchain Certificate System

CertiNexa is a decentralized application that allows organizations to issue, manage, and verify digital certificates on the blockchain. It provides a secure and tamper-proof way to store and share certificates, eliminating the need for traditional paper-based certificates.

## Project Structure

The project is divided into three main folders:

- `frontend`: Contains the React frontend application.
- `backend`: Contains the Node.js/Express backend server.
- `blockchain`: Contains the Solidity smart contract and Hardhat development environment.

### Frontend

The frontend is a React application that provides a user interface for interacting with the CertiNexa platform. It has different portals for different user roles:

- **Admin Portal:** For managing organizations and system settings.
- **Organization Portal:** For organizations to issue and manage certificates.
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
    │   │   ├── AdminSignup.jsx
    │   │   └── OrganizationDetails.jsx
    │   └── styles/
    │       └── ...
    ├── organization/
    │   ├── login.js
    │   ├── organization_dashboard.jsx
    │   ├── organization_pages/
    │   │   ├── CreateTemplate.jsx
    │   │   ├── IssueCertificate.jsx
    │   │   ├── ManageTemplates.jsx
    │   │   ├── Profile.jsx
    │   │   └── ViewCertificates.jsx
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
│   │   ├── organization.js
│   │   └── template.js
│   └── recepient/
│       └── recepient.js
├── routes/
│   ├── adminRoutes.js
│   ├── organization.js
│   ├── organizationlogin.js
│   ├── recepient.js
│   ├── recepientlogin.js
│   └── template.js
└── utils/
    └── emailService.js
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
├── test/
│   └── CertificateRegistry.test.ts
└── typechain-types/
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Hardhat
- MongoDB

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/certinexa.git
    cd certinexa
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Install blockchain dependencies:**

    ```bash
    cd ../blockchain
    npm install
    ```

## Running the Application

1.  **Start the MongoDB database:**

    Make sure you have MongoDB installed and running on your local machine.

2.  **Deploy the smart contract:**

    ```bash
    cd blockchain
    npx hardhat run ignition/modules/CertificateRegistry.ts --network localhost
    ```

3.  **Start the backend server:**

    ```bash
    cd ../backend
    npm start
    ```

    The backend server will be running on `http://localhost:5000`.

4.  **Start the frontend application:**

    ```bash
    cd ../frontend
    npm start
    ```

    The frontend application will be running on `http://localhost:3000`.

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
    - `POST /api/organization/template`: Create a new certificate template.
    - `GET /api/organization/templates`: Get all certificate templates for an organization.
- **Recipient:**
    - `POST /api/recepient/register`: Register a new recipient.
    - `POST /api/recepient/login`: Login a recipient.
- **Certificate:**
    - `POST /api/certificate/issue`: Issue a new certificate.
    - `GET /api/certificate/:id`: Get a certificate by its ID.

## Blockchain Smart Contract

The `CertificateRegistry` smart contract has the following functions:

- `storeCertificate(string memory _certificateId, string memory _certificateHash, string memory _signature)`: Stores a new certificate on the blockchain.
- `getCertificate(string memory _certificateId)`: Retrieves a certificate from the blockchain.
