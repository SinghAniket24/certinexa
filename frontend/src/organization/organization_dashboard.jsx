// organization_dashboard.jsx

import React, { useState } from 'react';
import './OrganizationDashboard.css';

import { 
  LayoutDashboard, 
  FilePlus, 
  Files, 
  Award, 
  List, 
  User, 
  LogOut, 
  CheckCircle 
} from 'lucide-react';

// Import Pages (you will create these later)
import CreateTemplate from "./organization_pages/CreateTemplate";
import ManageTemplates from "./organization_pages/ManageTemplates";
import IssueCertificate from "./organization_pages/IssueCertificate";
import ViewCertificates from "./organization_pages/ViewCertificates";
import Profile from "./organization_pages/Profile";


// --------------------------- SIDEBAR ---------------------------
const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="brand-title">
          <Award className="brand-icon" />
          Certinexa
        </h1>
        <p className="brand-subtitle">Org Admin Panel</p>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => setActivePage("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button 
          className={`nav-item ${activePage === "createTemplate" ? "active" : ""}`}
          onClick={() => setActivePage("createTemplate")}
        >
          <FilePlus size={18} />
          Create Template
        </button>

        <button 
          className={`nav-item ${activePage === "manageTemplates" ? "active" : ""}`}
          onClick={() => setActivePage("manageTemplates")}
        >
          <Files size={18} />
          Manage Templates
        </button>

        <button 
          className={`nav-item ${activePage === "issueCertificate" ? "active" : ""}`}
          onClick={() => setActivePage("issueCertificate")}
        >
          <Award size={18} />
          Issue Certificate
        </button>

        <button 
          className={`nav-item ${activePage === "viewCertificates" ? "active" : ""}`}
          onClick={() => setActivePage("viewCertificates")}
        >
          <List size={18} />
          View Certificates
        </button>
      </nav>

      <div className="sidebar-footer">
        <button 
          className={`footer-item ${activePage === "profile" ? "active" : ""}`}
          onClick={() => setActivePage("profile")}
        >
          <User size={18} />
          Profile
        </button>

        <button className="footer-item logout">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};


// --------------------------- DASHBOARD HOME ---------------------------
const DashboardHome = ({ setActivePage }) => (
  <div className="dashboard-content">

    <div className="welcome-card">
      <h2 className="welcome-title">Welcome back, Tech Institute!</h2>
      <p className="welcome-subtitle">Here's an overview of your certificate issuance activities.</p>
    </div>

    <div className="stats-grid">

      <div className="stat-card status-card">
        <div className="stat-header">
          <h3 className="stat-label">Organization Status</h3>
          <CheckCircle className="stat-icon-light" />
        </div>
        <p className="stat-value-large">
          Approved <span className="status-badge">Active</span>
        </p>
      </div>

      <div className="stat-card">
        <div className="stat-label">Total Issued</div>
        <div className="stat-value-placeholder"></div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Active Templates</div>
        <div className="stat-value-placeholder"></div>
      </div>

    </div>


    <h3 className="section-title">Quick Actions</h3>

    <div className="actions-grid">

      <button 
        className="action-card group"
        onClick={() => setActivePage("createTemplate")}
      >
        <div className="action-icon-wrapper blue">
          <FilePlus size={24} />
        </div>
        <h4 className="action-title">Create Template</h4>
        <p className="action-desc">Design a new certificate structure</p>
      </button>

      <button 
        className="action-card group"
        onClick={() => setActivePage("issueCertificate")}
      >
        <div className="action-icon-wrapper purple">
          <Award size={24} />
        </div>
        <h4 className="action-title">Issue Certificate</h4>
        <p className="action-desc">Send a certificate to a recipient</p>
      </button>

      <button 
        className="action-card group"
        onClick={() => setActivePage("viewCertificates")}
      >
        <div className="action-icon-wrapper emerald">
          <List size={24} />
        </div>
        <h4 className="action-title">View History</h4>
        <p className="action-desc">Browse all issued certificates</p>
      </button>

    </div>

  </div>
);


// --------------------------- MAIN COMPONENT ---------------------------
const OrganizationDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome setActivePage={setActivePage} />;
      case "createTemplate":
        return <CreateTemplate />;
      case "manageTemplates":
        return <ManageTemplates />;
      case "issueCertificate":
        return <IssueCertificate />;
      case "viewCertificates":
        return <ViewCertificates />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardHome setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container">

      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-layout">

        <header className="top-bar">
          <div className="breadcrumbs">
            <span>Organization Panel</span> /
            <span className="current-crumb">{activePage}</span>
          </div>

          <div className="user-profile">
            <div className="user-info">
              <div className="user-name">Tech Institute</div>
              <div className="user-role">Verified Org</div>
            </div>

            <div className="user-avatar">
              <User size={20} />
            </div>
          </div>
        </header>

        {renderPage()}

      </main>
    </div>
  );
};

export default OrganizationDashboard;
