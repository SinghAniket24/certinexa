import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { mockOrganizations } from '../data/mockOrgnizations';
import { Search, CheckCircle, XCircle, Clock, Filter, Eye } from 'lucide-react';
// IMPORT EXTERNAL CSS
import '../styles/variables.css';
import '../styles/AdminDashboard.css';
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('organizations');
    const [organizations, setOrganizations] = useState(mockOrganizations);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleStatusChange = (id, newStatus) => {
        const updatedOrgs = organizations.map(org =>
            org.org_id === id ? { ...org, verificationStatus: newStatus } : org
        );
        setOrganizations(updatedOrgs);
    };

    const filteredOrgs = organizations.filter(org => {
        const matchesStatus = filterStatus === 'all' || org.verificationStatus === filterStatus;
        const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            org.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
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
                        <div className="stat-value">{organizations.filter(o => o.verificationStatus === 'pending').length}</div>
                    </div>
                    <div className="stat-card approved">
                        <div className="stat-label">Verified Partners</div>
                        <div className="stat-value">{organizations.filter(o => o.verificationStatus === 'approved').length}</div>
                    </div>
                    <div className="stat-card rejected">
                        <div className="stat-label">Rejected</div>
                        <div className="stat-value">{organizations.filter(o => o.verificationStatus === 'rejected').length}</div>
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

                    {/* Table */}
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
                                <tr key={org.org_id}>
                                    <td>
                                        <span className="org-name">{org.name}</span>
                                        <span className="org-email">{org.email}</span>
                                    </td>
                                    <td>
                                        <div className="org-reg">{org.registrationNumber}</div>
                                        <span className="industry-tag">{org.industryType}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="doc-link"
                                            onClick={() => console.log("View Docs clicked")}
                                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                        >
                                            <Eye size={14} /> View Docs
                                        </button>
                                    </td>
                                    <td>
                                        {getStatusBadge(org.verificationStatus)}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {org.verificationStatus === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(org.org_id, 'approved')}
                                                    className="action-btn btn-approve"
                                                    title="Approve"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(org.org_id, 'rejected')}
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
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;