// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract CertificateRegistry {
    struct CertificateData {
        string certificateHash;
        string signature;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => CertificateData) public certificates;

    event CertificateStored(string indexed certificateId, string certificateHash);

    function storeCertificate(
        string memory _certificateId, 
        string memory _certificateHash, 
        string memory _signature
    ) public {
        require(!certificates[_certificateId].exists, "Certificate ID already exists");

        certificates[_certificateId] = CertificateData({
            certificateHash: _certificateHash,
            signature: _signature,
            timestamp: block.timestamp,
            exists: true
        });

        emit CertificateStored(_certificateId, _certificateHash);
    }

    function getCertificate(string memory _certificateId) 
        public 
        view 
        returns (string memory, string memory, uint256) 
    {
        require(certificates[_certificateId].exists, "Certificate not found");
        CertificateData memory cert = certificates[_certificateId];
        return (cert.certificateHash, cert.signature, cert.timestamp);
    }
}