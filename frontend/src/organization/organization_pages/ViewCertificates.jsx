import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaTimes, FaCopy, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CertificateTemplate from "../../recepient/CertificateTemplate";
import "./ViewCertificate.css";

export default function ViewCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCert, setViewingCert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔴 delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 🔵 added for download
  const certRef = useRef();

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

  // ================= DOWNLOAD CERTIFICATE =================
  const downloadPDF = async () => {
    if (!viewingCert) return;

    const element = certRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [800, 600]);
    pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
    pdf.save(`${viewingCert.certificateName}.pdf`);
  };

  // ================= DELETE CERTIFICATE =================
  const handleDelete = (certId) => {
    setDeleteTarget(certId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(
        `http://localhost:5000/certificate/${deleteTarget}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setCertificates((prev) =>
          prev.filter((c) => c._id !== deleteTarget)
        );

        if (viewingCert && viewingCert._id === deleteTarget) {
          closeView();
        }

        setDeleteTarget(null);
      } else {
        alert("Failed to delete certificate");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting certificate");
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  /* ================= 🔍 SEARCH ================= */
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

                    <button
                      className="vc-btn-delete"
                      onClick={() => handleDelete(cert._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* ================= VIEW MODAL ================= */}
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
                      {viewingCert.blockchainTxId?.substring(0, 15)}
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

              {/* 🔵 DOWNLOAD BUTTON (ADDED) */}
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                  className="vc-btn-view"
                  onClick={downloadPDF}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteTarget && (
        <div className="vc-modal">
          <div className="vc-modal-content" style={{ maxWidth: "420px" }}>
            <div className="vc-modal-header">
              <h3>Confirm Delete</h3>
              <FaTimes
                className="vc-close-icon"
                onClick={cancelDelete}
              />
            </div>

            <div className="vc-modal-body">
              <p style={{ color: "#64748b", marginBottom: "22px" }}>
                Are you sure you want to delete this certificate?
                <br />
                This action cannot be undone.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  className="vc-btn-view"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>

                <button
                  className="vc-btn-delete"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 HIDDEN TEMPLATE FOR PDF */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <CertificateTemplate ref={certRef} data={viewingCert} />
      </div>
    </div>
  );
}
