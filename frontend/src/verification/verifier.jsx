// VerifierPortal.jsx

import React, { useState } from "react";
import "./verifier.css";
import { FaShieldAlt } from "react-icons/fa";

const VerifierPortal = () => {
  const [link, setLink] = useState("");
  const [resultData, setResultData] = useState(null);

  const handleVerify = () => {
    if (!link) {
      setResultData({
        status: "alert",
        message: "Please enter a certificate link or ID.",
      });
      return;
    }

    // Dummy verification logic
    if (link.toLowerCase().includes("valid")) {
      setResultData({
        status: "valid",
        message: "Certificate is Valid",
        issuer: "CertiNexa Blockchain Authority",
        holder: "John Doe",
        issuedOn: "12 Oct 2025",
        issuedby: "edtech",
        certificateId: "CERTX-8492-VALID",
        hash: "0x8df92a0b7c5abf92d1a8ce2390f19ab937bd1e92f91f0ad77ac5",
      });
    } else {
      setResultData({
        status: "invalid",
        message: "Certificate is Invalid",
        hash: "0x00000000000000000000000000000000000000000",
      });
    }
  };

  return (
    <div className="container">
      <div className="big-card">

        {/* Icon */}
        <div className="icon-wrapper">
          <FaShieldAlt className="shield-icon" />
        </div>

        <h1 className="title">CertiNexa Verifier</h1>

        <p className="description">
          Verify blockchain-secured digital certificates issued through CertiNexa. 
          Enter a certificate link or ID below to check authenticity instantly.
        </p>

        <input
          type="text"
          placeholder="Paste certificate link or ID "
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="input"
        />

        <button className="button" onClick={handleVerify}>
          Verify Certificate
        </button>

        {/* RESULT */}
        {resultData && (
          <div
            className={`result-box ${
              resultData.status === "valid"
                ? "valid"
                : resultData.status === "invalid"
                ? "invalid"
                : "alert"
            }`}
          >
            <div className="status-icon">
              {resultData.status === "valid" ? "✅" : "❌"}
            </div>

            <div className="status-text">{resultData.message}</div>

            {/* Valid Details */}
            {resultData.status === "valid" && (
              <div className="details-grid">
                <div><strong>Issuer:</strong> {resultData.issuer}</div>
                <div><strong>Holder:</strong> {resultData.holder}</div>
                <div><strong>Issued On:</strong> {resultData.issuedOn}</div>
                <div><strong>Certificate ID:</strong> {resultData.certificateId}</div>
                <div className="hash">
                  <strong>Hash:</strong> {resultData.hash}
                </div>
              </div>
            )}

            {/* Invalid */}
            {resultData.status === "invalid" && (
              <div className="hash">
                <strong>Hash:</strong> {resultData.hash}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifierPortal;
