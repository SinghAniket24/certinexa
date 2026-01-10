import React, { useState } from "react";
import "./verifier.css";
import { FaShieldAlt } from "react-icons/fa";

const VerifierPortal = () => {
  const [link, setLink] = useState("");
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleVerify = async () => {
    setResultData(null);
    setShowDetails(false);

    if (!link.trim()) {
      return setResultData({
        status: "alert",
        message: "⚠ Please enter a certificate ID.",
      });
    }

    const certificateId = link.trim();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/verify/${certificateId}`);
      const data = await res.json();

      if (data.valid) {
        setResultData({
          status: "valid",
          message: data.message,
          certificateName: data.certificateName,
          issuer: data.issuer,
          recipientEmail: data.recipientEmail,
          issuedOn: new Date(data.issuedOn).toLocaleString(),
          certificateId: data.certificateId,
          blockchainTxId: data.blockchainTxId,
          hash: data.hash,
          fields: data.fields || {},
        });
      } else {
        setResultData({
          status: "invalid",
          message: data.message || "Certificate NOT VERIFIED ❌",
          hash: data.hash || "N/A",
        });
      }

    } catch (error) {
      console.error("⚠ Verification Error:", error);
      setResultData({
        status: "invalid",
        message: "Server Error! Try again 🔁",
      });
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="big-card">

        <div className="icon-wrapper">
          <FaShieldAlt className="shield-icon" />
        </div>

        <h1 className="title">CertiNexa Verifier</h1>
        <p className="description">
          Verify blockchain-secured certificates instantly.
        </p>

        <input
          type="text"
          placeholder="Example: XYZ-A1B2C3"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="input"
        />

        <button className="button" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>

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
              {resultData.status === "valid"
                ? ""
                : resultData.status === "invalid"
                ? "🔴"
                : "⚠️"}
            </div>

            <div className="status-text">{resultData.message}</div>

            {/* VALID CERTIFICATE — QUICK SUMMARY */}
            {resultData.status === "valid" && (
              <>
                <div className="summary">
                  ✔ Issued to: <strong>{resultData.recipientEmail}</strong>  
                  <br />
                  ✔ By: <strong>{resultData.issuer}</strong>
                </div>

                {/* Toggle Button */}
                <button
                  className="view-more-btn"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Full Details ▲" : "View Full Details ▼"}
                </button>

                {/* Full Details Panel */}
                {showDetails && (
                  <div className="details-grid fade-in">

                    <div><strong>Certificate Name:</strong> {resultData.certificateName}</div>
                    <div><strong>Recipient Email:</strong> {resultData.recipientEmail}</div>
                    <div><strong>Issued On:</strong> {resultData.issuedOn}</div>

                    <div><strong>Certificate ID:</strong> {resultData.certificateId}</div>
                    <div><strong>Blockchain Tx:</strong> {resultData.blockchainTxId}</div>

                    <div className="hash"><strong>Hash:</strong> {resultData.hash}</div>

                    <div className="field-section">
                      <strong>Certificate Fields:</strong>
                      {Object.entries(resultData.fields).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </>
            )}

            {/* INVALID VIEW */}
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