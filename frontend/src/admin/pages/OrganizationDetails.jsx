import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle, XCircle, AlertTriangle, FileText, MapPin, Mail, Phone, Hash, Calendar } from 'lucide-react';
import '../styles/OrganizationStyles.css';

const OrganizationDetails = ({ org, onClose, onUpdateStatus }) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!org) return null;

    // Handle Approve / Reject logic
    const handleAction = async (status) => {
        if (status === 'rejected' && !rejectionReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/organization/${org._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    rejectionReason: status === 'rejected' ? rejectionReason : null
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update the parent state so the table reflects the change
                const reasonToPass = status === 'rejected' ? rejectionReason : "";
                onUpdateStatus(org._id, status,reasonToPass);

                // Optional: If you want to keep the modal open to see the change, comment out onClose()
                // For now, we close it to return to the dashboard
                onClose();
            } else {
                alert(data.message || "Action failed");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="details-overlay" onClick={onClose}>
            <div className="details-modal" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <header className="details-header">
                    <div className="header-left">
                        <h2>{org.organizationName}</h2>
                        <span className={`status-badge ${org.verification_status}`}>
                            {org.verification_status === 'approved' && <CheckCircle size={14} />}
                            {org.verification_status === 'rejected' && <XCircle size={14} />}
                            {org.verification_status.toUpperCase()}
                        </span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                {/* Content */}
                <div className="details-content">

                    {/* --- DYNAMIC STATUS BANNER --- */}
                    {org.verification_status === 'rejected' && (
                        <div className="status-banner rejected-banner">
                            <div className="banner-header">
                                <XCircle size={20} />
                                <h3>Organization Rejected</h3>
                            </div>
                            <div className="banner-content">
                                <span className="reason-label">Reason for Rejection:</span>
                                <p className="reason-text">
                                    {org.rejection_reason || "No specific reason was provided by the administrator."}
                                </p>
                            </div>
                        </div>
                    )}

                    {org.verification_status === 'approved' && (
                        <div className="status-banner approved-banner">
                            <div className="banner-header">
                                <CheckCircle size={20} />
                                <h3>Verified Organization</h3>
                            </div>
                            <p className="banner-text">
                                This organization has been fully verified and is authorized to issue certificates on the blockchain.
                            </p>
                        </div>
                    )}

                    {/* Section 1: General Info */}
                    <div className="details-section">
                        <div className="section-title">General Information</div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Organization Name</span>
                                <span className="info-value">{org.organizationName}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><Hash size={12} /> Registration No.</span>
                                <span className="info-value">{org.registrationNumber || "N/A"}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Type</span>
                                <span className="info-value">
                                    {org.organizationType} {org.customType ? `(${org.customType})` : ''}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><Calendar size={12} /> Applied On</span>
                                <span className="info-value">{formatDate(org.createdAt)}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label">Wallet Address</span>
                                <span className="info-value font-mono">
                                    {org.walletAddress || "Waiting for verification to generate wallet..."}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contact Info */}
                    <div className="details-section">
                        <div className="section-title">Contact & Location</div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label"><Mail size={12} /> Official Email</span>
                                <span className="info-value">{org.officialEmail}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label"><Phone size={12} /> Phone</span>
                                <span className="info-value">{org.officialPhone}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label"><MapPin size={12} /> Address</span>
                                <span className="info-value">{org.organizationAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Verification */}
                    <div className="details-section">
                        <div className="section-title">Verification Documents</div>
                        <div className="info-item full-width">
                            <span className="info-label">Submitted Document</span>
                            <div style={{ marginTop: '8px' }}>
                                <a
                                    href={org.verificationDocument}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="doc-link-btn"
                                >
                                    <FileText size={18} /> View Verification Document <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ACTION AREA: Rejection Input (Only visible when clicking Reject) */}
                    {isRejecting && (
                        <div className="rejection-area">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: '600' }}>
                                <AlertTriangle size={18} /> Rejection Reason
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: '5px 0' }}>
                                Please specify why this organization is being rejected. This will be emailed to them.
                            </p>
                            <textarea
                                className="rejection-input"
                                placeholder="e.g., The registration document provided is blurry or does not match the organization name..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <footer className="details-footer">
                    {/* IF PENDING: Show Actions */}
                    {org.verification_status === 'pending' ? (
                        <>
                            {!isRejecting ? (
                                <>
                                    <button className="btn-action btn-secondary" onClick={() => setIsRejecting(true)}>
                                        <XCircle size={18} /> Reject
                                    </button>
                                    <button
                                        className="btn-action btn-approve"
                                        onClick={() => handleAction('approved')}
                                        disabled={loading}
                                    >
                                        {loading ? 'Verifying...' : <><CheckCircle size={18} /> Verify Organization</>}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="btn-action btn-secondary" onClick={() => setIsRejecting(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-action btn-confirm-reject"
                                        onClick={() => handleAction('rejected')}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Confirm Rejection'}
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        // IF ALREADY VERIFIED/REJECTED: Show Close
                        <button className="btn-action btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default OrganizationDetails;