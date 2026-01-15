import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiCheckCircle, FiExternalLink, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CertificateTemplate from "./CertificateTemplate"; 
import "./recipient_dashboard.css";

const RecipientDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null); // State for Modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const certRef = useRef();

  useEffect(() => {
    const fetchCertificates = async () => {
      const token = localStorage.getItem("recepientToken");

      if (!token) {
        navigate("/recepient/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/recepient/my-certificates", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("recepientToken");
            navigate("/recepient/login");
          }
          throw new Error(data.message || "Failed to fetch certificates");
        }

        if (Array.isArray(data)) {
            setCertificates(data);
        } else {
            setCertificates([]); 
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("recepientToken");
    navigate("/recepient/login");
  };

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  const downloadPDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    
    const pdf = new jsPDF("landscape", "px", [800, 600]);
    pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
    pdf.save(`${selectedCert.certificateName}.pdf`);
  };

  if (loading) return <div className="dash-loading">Loading Dashboard...</div>;

return (
    <div className="dash-container">
      <header className="dash-header">
        <div className="dash-brand">CertiNexa</div>
        <div className="dash-user-menu">
            <span className="dash-welcome">My Dashboard</span>
            <button onClick={handleLogout} className="dash-logout-btn">Logout</button>
        </div>
      </header>

      <main className="dash-content">
        <div className="dash-title-section">
            <h1 className="dash-title">My Certificates</h1>
            <p className="dash-subtitle">View and verify your blockchain-secured credentials.</p>
        </div>
        
        {error && <div className="dash-error-banner">{error}</div>}

        {certificates.length === 0 && !error ? (
          <div className="dash-empty-state">
            <h3>No certificates found</h3>
            <p>Certificates issued to your email will appear here.</p>
          </div>
        ) : (
          <div className="dash-grid">
            {certificates.map((cert) => (
              <div key={cert._id} className="dash-card">
                <div className="card-badge"><FiCheckCircle /> Verified</div>
                <h3 className="card-title">{cert.certificateName}</h3>
                <p className="card-org">Issued by {cert.orgName}</p>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Issued:</span>
                    <span className="detail-value">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="card-actions">
                    <button 
                      className="btn-view" 
                      onClick={() => setSelectedCert(cert)}
                    >
                      View Full Details
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* HIDDEN DOWNLOAD TEMPLATE 
          This is what jsPDF/html2canvas will capture. 
          It stays off-screen but stays updated with selectedCert data.
      */}
      <div style={{ position: "absolute", left: "-9999px", top: "0" }}>
        <CertificateTemplate ref={certRef} data={selectedCert} />
      </div>

      {/* ================= MODAL POPUP ================= */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close" onClick={() => setSelectedCert(null)}>
              <FiX />
            </button>

            <div className="modal-header">
              <h2>{selectedCert.certificateName}</h2>
              <span className="modal-badge">Verified on Blockchain</span>
            </div>

            <div className="modal-body">
              <div className="info-group">
                <label>Issued By</label>
                <p>{selectedCert.orgName}</p>
              </div>
              <div className="info-group">
                <label>Issued To</label>
                <p>{selectedCert.recipientEmail}</p>
              </div>
              <div className="info-group">
                <label>Date Issued</label>
                <p>{formatDate(selectedCert.issuedAt)}</p>
              </div>
              <div className="info-group">
                <label>Certificate ID</label>
                <p className="mono-text">{selectedCert.certificateId}</p>
              </div>

              <hr className="modal-divider" />

              <h4 className="section-title">Certificate Details</h4>
              <div className="dynamic-fields-grid">
                {Object.entries(selectedCert.fields || {}).map(([key, value]) => (
                  <div key={key} className="info-group">
                    <label>{key}</label>
                    <p>{value}</p>
                  </div>
                ))}
              </div>

              <hr className="modal-divider" />

              <h4 className="section-title">Technical Verification</h4>
              
              <div className="info-group">
                <label>Blockchain Transaction ID</label>
                {selectedCert.blockchainTxId ? (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${selectedCert.blockchainTxId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="tx-link"
                  >
                    {selectedCert.blockchainTxId} <FiExternalLink />
                  </a>
                ) : (
                  <p className="text-muted">Pending Blockchain Sync...</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedCert(null)}>Close</button>
              
              {/* UPDATED: Calling the downloadPDF function */}
              <button 
                className="btn-primary" 
                onClick={downloadPDF}
                disabled={!selectedCert}
              >
                <FiDownload /> Download PDF
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientDashboard;