import React, { useState, useEffect } from "react";
import { FaEye, FaTimes, FaCopy } from "react-icons/fa";

import "./ViewCertificate.css";

export default function ViewCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCert, setViewingCert] = useState(null);

  const token = localStorage.getItem("org_token");

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch("http://localhost:5000/certificate/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          const sorted = data.certificates.sort((a, b) =>
            new Date(b.issuedAt) - new Date(a.issuedAt)
          );
          setCertificates(sorted);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching certificates: ", error);
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

  return (
    <div className="vc-wrap">
      <h2 className="vc-title">Issued Certificates</h2>

      {loading ? (
        <div className="vc-loading">Loading...</div>
      ) : certificates.length === 0 ? (
        <div className="vc-empty">No certificates found.</div>
      ) : (
        <div className="vc-grid">
          {certificates.map((cert) => (
            <div className="vc-card" key={cert._id}>
              <h3 className="vc-card-title">{cert.certificateName || "Untitled"}</h3>

              <p className="vc-field">Email: {cert.recipientEmail}</p>
              <p className="vc-field">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>

              <div className="vc-card-actions">
                <button className="vc-btn-view" onClick={() => openView(cert)}>
                  <FaEye /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {viewingCert && (
        <div className="vc-modal">
          <div className="vc-modal-content">
            <div className="vc-modal-header">
              <h3>{viewingCert.certificateName}</h3>
              <FaTimes className="vc-close-icon" onClick={closeView} />
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
                      {new Date(viewingCert.issuedAt).toLocaleString()}
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
                      {viewingCert.blockchainTxId?.substring(0, 15)}...
                      <FaCopy
                        className="vc-copy-icon"
                        onClick={() =>
                          copyToClipboard(viewingCert.blockchainTxId)
                        }
                      />
                      {/* <a
                        className="vc-external-link"
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaExternalLinkAlt />
                      </a> */}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="vc-section-title">Certificate Fields</div>

              <table className="vc-detail-table">
                <tbody>
                  {Object.entries(viewingCert.fields).map(([label, value]) => (
                    <tr key={label}>
                      <th>{label}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
