import React, { useState, useEffect } from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import "./ViewCertificate.css";

export default function ViewCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [viewingCert, setViewingCert] = useState(null);

  useEffect(() => {
    const savedCerts = JSON.parse(localStorage.getItem("issued_certificates") || "[]");
    savedCerts.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
    setCertificates(savedCerts);
  }, []);

  const openView = (cert) => setViewingCert(cert);
  const closeView = () => setViewingCert(null);

  return (
    <div className="vc-wrap">
      <h2 className="vc-title">Issued Certificates</h2>

      {certificates.length === 0 ? (
        <div className="vc-empty">No certificates issued yet.</div>
      ) : (
        <div className="vc-grid">
          {certificates.map(cert => (
            <div className="vc-card" key={cert.id}>
              <div className="vc-card-header">
                <h3 className="vc-card-title">{cert.fields["Student Name"] || "N/A"}</h3>
                <FaEye className="vc-view-icon" title="View Details" onClick={() => openView(cert)} />
              </div>
              <div className="vc-card-tags">
                <span className="vc-tag">{cert.templateName}</span>
                <span className="vc-tag">{cert.fields["Email"]}</span>
              </div>
              <div className="vc-card-footer">
                <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                <span>ID: {cert.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingCert && (
        <div className="vc-modal">
          <div className="vc-modal-content">
            <div className="vc-modal-header">
              <h3>{viewingCert.fields["Student Name"]}</h3>
              <FaTimes className="vc-close-icon" onClick={closeView} />
            </div>
            <div className="vc-modal-body">
              <div className="vc-modal-row"><span>ID:</span> {viewingCert.id}</div>
              <div className="vc-modal-row"><span>Template:</span> {viewingCert.templateName}</div>
              <div className="vc-modal-row"><span>Email:</span> {viewingCert.fields["Email"]}</div>
              <div className="vc-modal-row"><span>Issued At:</span> {new Date(viewingCert.issuedAt).toLocaleString()}</div>
              {Object.keys(viewingCert.fields).map(key => (
                key !== "Email" && key !== "Student Name" && (
                  <div className="vc-modal-row" key={key}>
                    <span>{key}:</span> {viewingCert.fields[key]}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
