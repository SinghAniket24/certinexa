import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, CheckCircle, XCircle, Clock, Filter, Eye } from 'lucide-react';
import OrganizationDetails from './OrganizationDetails';
import '../styles/variables.css';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('organizations');
    const [organizations, setOrganizations] = useState([]); 
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrg, setSelectedOrg] = useState(null);

    // 1. FETCH DATA ON MOUNT
    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/organizations');
            const data = await response.json();
            if (Array.isArray(data)) {
                setOrganizations(data);
            }
        } catch (error) {
            console.error("Error fetching organizations:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. HELPER: PURE LOCAL STATE UPDATE 
    // ✅ FIXED LOGIC HERE
    const updateLocalState = (id, newStatus, rejectionReason = null) => {
        setOrganizations(prevOrgs => 
            prevOrgs.map(org => {
                if (org._id === id) {
                    
                    // Logic: Calculate the new rejection reason
                    let updatedReason = org.rejection_reason; // Default to existing

                    if (newStatus !== 'rejected') {
                        // If Approving or Pending, ALWAYS clear the reason
                        updatedReason = ""; 
                    } else if (rejectionReason !== null) {
                        // If Rejecting AND a new reason is provided, use it
                        updatedReason = rejectionReason; 
                    }

                    return { 
                        ...org, 
                        verification_status: newStatus,
                        rejection_reason: updatedReason
                    };
                }
                return org;
            })
        );

        // Also update the selectedOrg if it is currently open
        if (selectedOrg && selectedOrg._id === id) {
            setSelectedOrg(prev => {
                // Same logic for selectedOrg
                let updatedReason = prev.rejection_reason;
                if (newStatus !== 'rejected') {
                    updatedReason = "";
                } else if (rejectionReason !== null) {
                    updatedReason = rejectionReason;
                }

                return {
                    ...prev, 
                    verification_status: newStatus,
                    rejection_reason: updatedReason
                };
            });
        }
    };

    // 3. HANDLE TABLE BUTTON CLICKS (Approve/Reject from Table)
    const handleStatusChange = async (id, newStatus) => {
        // Optimistic UI Update
        const previousOrgs = [...organizations];
        
        // Note: Table buttons don't provide a reason, so we pass null
        updateLocalState(id, newStatus, null); 

        try {
            const response = await fetch(`http://localhost:5000/api/admin/organization/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                // If API fails, revert the change
                setOrganizations(previousOrgs);
                alert("Failed to update status on server.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setOrganizations(previousOrgs);
        }
    };

    // 4. FILTER LOGIC
    const filteredOrgs = organizations.filter(org => {
        const matchesStatus = filterStatus === 'all' || org.verification_status === filterStatus;
        const nameMatch = org.organizationName?.toLowerCase().includes(searchQuery.toLowerCase());
        const regMatch = org.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && (nameMatch || regMatch);
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="status-badge approved"><CheckCircle size={14} /> Verified</span>;
            case 'rejected':
                return <span className="status-badge rejected"><XCircle size={14} /> Rejected</span>;
            default:
                return <span className="status-badge pending"><Clock size={14} /> Pending</span>;
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>Organization Verification</h1>
                        <p>Review and verify registration requests.</p>
                    </div>

                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name or Reg ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card pending">
                        <div className="stat-label">Pending Requests</div>
                        <div className="stat-value">{organizations.filter(o => o.verification_status === 'pending').length}</div>
                    </div>
                    <div className="stat-card approved">
                        <div className="stat-label">Verified Partners</div>
                        <div className="stat-value">{organizations.filter(o => o.verification_status === 'approved').length}</div>
                    </div>
                    <div className="stat-card rejected">
                        <div className="stat-label">Rejected</div>
                        <div className="stat-value">{organizations.filter(o => o.verification_status === 'rejected').length}</div>
                    </div>
                </div>

                <div className="table-container">
                    <div className="tabs-header">
                        <Filter size={18} style={{ color: '#94a3b8' }} />
                        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilterStatus(tab)}
                                className={`filter-tab ${filterStatus === tab ? 'active' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                            Loading Organization Data...
                        </div>
                    ) : (
                        <table className="org-table">
                            <thead>
                                <tr>
                                    <th>Organization</th>
                                    <th>Registration Details</th>
                                    <th>Verification Doc</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrgs.length > 0 ? filteredOrgs.map((org) => (
                                    <tr 
                                        key={org._id} 
                                        onClick={() => setSelectedOrg(org)} 
                                        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                        className="org-row"
                                    >
                                        <td>
                                            <span className="org-name">{org.organizationName}</span>
                                            <span className="org-email">{org.officialEmail}</span>
                                        </td>
                                        <td>
                                            <div className="org-reg">{org.registrationNumber}</div>
                                            <span className="industry-tag">{org.organizationType}</span>
                                        </td>
                                        <td>
                                            <a 
                                                href={org.verificationDocument} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="doc-link"
                                                onClick={(e) => e.stopPropagation()} 
                                                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'none' }}
                                            >
                                                <Eye size={14} /> View Docs
                                            </a>
                                        </td>
                                        <td>
                                            {getStatusBadge(org.verification_status)}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {org.verification_status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); 
                                                            handleStatusChange(org._id, 'approved');
                                                        }}
                                                        className="action-btn btn-approve"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation(); 
                                                            handleStatusChange(org._id, 'rejected');
                                                        }}
                                                        className="action-btn btn-reject"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="no-action">--</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                            No organizations found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
            
            {/* MODAL INTEGRATION */}
            {selectedOrg && (
                <OrganizationDetails 
                    org={selectedOrg} 
                    onClose={() => setSelectedOrg(null)} 
                    onUpdateStatus={updateLocalState} 
                />
            )}
            
        </div>
    );
};

export default AdminDashboard;