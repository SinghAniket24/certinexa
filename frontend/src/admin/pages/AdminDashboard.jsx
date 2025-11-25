import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, CheckCircle, XCircle, Clock, Filter, Eye } from 'lucide-react';
// IMPORT EXTERNAL CSS
import '../styles/variables.css';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('organizations');
    const [organizations, setOrganizations] = useState([]); // Default to empty array
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true); // Added loading state

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

    // 2. HANDLE STATUS UPDATE (Approve/Reject)
    const handleStatusChange = async (id, newStatus) => {
        // Optimistic UI Update (Update UI immediately for better UX)
        const previousOrgs = [...organizations];
        const updatedOrgs = organizations.map(org =>
            org._id === id ? { ...org, verification_status: newStatus } : org
        );
        setOrganizations(updatedOrgs);

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

    // 3. FILTER LOGIC
    const filteredOrgs = organizations.filter(org => {
        // Match status (using verification_status)
        const matchesStatus = filterStatus === 'all' || org.verification_status === filterStatus;
        
        // Match search (using organizationName & registrationNumber)
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
                {/* Header */}
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

                {/* Stats Cards */}
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

                {/* Table Container */}
                <div className="table-container">
                    {/* Tabs */}
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

                    {/* Table Content */}
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
                                    <tr key={org._id}>
                                        <td>
                                            {/* Corrected Field: organizationName */}
                                            <span className="org-name">{org.organizationName}</span>
                                            {/* Corrected Field: officialEmail */}
                                            <span className="org-email">{org.officialEmail}</span>
                                        </td>
                                        <td>
                                            <div className="org-reg">{org.registrationNumber}</div>
                                            {/* Corrected Field: organizationType */}
                                            <span className="industry-tag">{org.organizationType}</span>
                                        </td>
                                        <td>
                                            {/* Document Link */}
                                            <a 
                                                href={org.verificationDocument} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="doc-link"
                                                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'none' }}
                                            >
                                                <Eye size={14} /> View Docs
                                            </a>
                                        </td>
                                        <td>
                                            {/* Corrected Field: verification_status */}
                                            {getStatusBadge(org.verification_status)}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {org.verification_status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(org._id, 'approved')}
                                                        className="action-btn btn-approve"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(org._id, 'rejected')}
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
        </div>
    );
};

export default AdminDashboard;