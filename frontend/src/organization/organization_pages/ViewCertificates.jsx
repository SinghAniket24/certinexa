import React, { useState, useEffect } from "react";
import { FaEye, FaTimes, FaCopy, FaSearch } from "react-icons/fa";
import "./ViewCertificate.css";

export default function ViewCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCert, setViewingCert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("org_token");

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch("http://localhost:5000/certificate/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          const sorted = data.certificates.sort(
            (a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)
          );
          setCertificates(sorted);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
      setLoading(false);
    };

    fetchCerts();
  }, [token]);

  const openView = (cert) => setViewingCert(cert);
  const closeView = () => setViewingCert(null);

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    alert("Copied!");
  };

  /* ================= 🔍 SEARCH (FIXED) ================= */
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCertificates = certificates.filter((cert) => {
    const email = cert.recipientEmail?.toLowerCase() || "";
    const certId = cert.certificateId?.toLowerCase() || "";
    const certName = cert.certificateName?.toLowerCase() || "";

    return (
      email.includes(normalizedSearch) ||
      certId.includes(normalizedSearch) ||
      certName.includes(normalizedSearch)
    );
  });

  /* ================= 📦 GROUP BY TEMPLATE ================= */
  const groupedByTemplate = filteredCertificates.reduce((acc, cert) => {
    const template = cert.certificateName || "Untitled";
    if (!acc[template]) acc[template] = [];
    acc[template].push(cert);
    return acc;
  }, {});

  return (
    <div className="vc-wrap">
      <h2 className="vc-title">Issued Certificates</h2>

      {/* 🔍 SEARCH BAR */}
      <div className="vc-search-wrapper">
        <FaSearch className="vc-search-icon" />
        <input
          type="text"
          className="vc-search"
          placeholder="Search by email, certificate ID, or template name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="vc-loading">Loading...</div>
      ) : filteredCertificates.length === 0 ? (
        <div className="vc-empty">No certificates found.</div>
      ) : (
        Object.entries(groupedByTemplate).map(([templateName, certs]) => (
          <div key={templateName} className="vc-template-group">
            <h3 className="vc-template-title">{templateName}</h3>

            <div className="vc-grid">
              {certs.map((cert) => (
                <div className="vc-card" key={cert._id}>
                  <p className="vc-field">
                    Email: {cert.recipientEmail}
                  </p>
                  <p className="vc-field">
                    Issued:{" "}
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>

                  <div className="vc-card-actions">
                    <button
                      className="vc-btn-view"
                      onClick={() => openView(cert)}
                    >
                      <FaEye /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* ================= MODAL ================= */}
      {viewingCert && (
        <div className="vc-modal">
          <div className="vc-modal-content">
            <div className="vc-modal-header">
              <h3>{viewingCert.certificateName}</h3>
              <FaTimes
                className="vc-close-icon"
                onClick={closeView}
              />
            </div>

            <div className="vc-modal-body">
              <table className="vc-detail-table">
                <tbody>
                  <tr>
                    <th>Certificate ID</th>
                    <td className="vc-copy-link-row">
                      {viewingCert.certificateId}
                      <FaCopy
                        className="vc-copy-icon"
                        onClick={() =>
                          copyToClipboard(viewingCert.certificateId)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Recipient</th>
                    <td>{viewingCert.recipientEmail}</td>
                  </tr>
                  <tr>
                    <th>Issued On</th>
                    <td>
                      {new Date(
                        viewingCert.issuedAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="vc-section-title">Blockchain</div>

              <table className="vc-detail-table">
                <tbody>
                  <tr>
                    <th>Transaction ID</th>
                    <td className="vc-copy-link-row">
                      {viewingCert.blockchainTxId?.substring(
                        0,
                        15
                      )}
                      ...
                      <FaCopy
                        className="vc-copy-icon"
                        onClick={() =>
                          copyToClipboard(
                            viewingCert.blockchainTxId
                          )
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="vc-section-title">
                Certificate Fields
              </div>

              <table className="vc-detail-table">
                <tbody>
                  {Object.entries(viewingCert.fields).map(
                    ([label, value]) => (
                      <tr key={label}>
                        <th>{label}</th>
                        <td>{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
