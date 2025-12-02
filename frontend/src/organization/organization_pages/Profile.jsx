import React, { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile() {
  const [orgDetails, setOrgDetails] = useState({
    name: "My Organization",
    email: "org@example.com",
    status: "Approved",
    contact: "+91 9876543210",
    address: "123, Main Street, Mumbai",
    registrationDate: "2024-01-15"
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("org_profile") || "{}");
    if (Object.keys(saved).length) setOrgDetails(saved);
  }, []);

  return (
    <div className="pf-wrap">
      <h2 className="pf-title">Organization Profile</h2>
      
      <div className="pf-profile-card">
        <div className="pf-row">
          <span className="pf-label">Organization Name</span>
          <span className="pf-value">{orgDetails.name}</span>
        </div>
        <div className="pf-row">
          <span className="pf-label">Email</span>
          <span className="pf-value">{orgDetails.email}</span>
        </div>
        <div className="pf-row">
          <span className="pf-label">Status</span>
          <span className={`pf-value pf-status ${orgDetails.status.toLowerCase()}`}>
            {orgDetails.status}
          </span>
        </div>
        <div className="pf-row">
          <span className="pf-label">Contact</span>
          <span className="pf-value">{orgDetails.contact}</span>
        </div>
        <div className="pf-row">
          <span className="pf-label">Address</span>
          <span className="pf-value">{orgDetails.address}</span>
        </div>
        <div className="pf-row">
          <span className="pf-label">Registered On</span>
          <span className="pf-value">{orgDetails.registrationDate}</span>
        </div>
      </div>
    </div>
  );
}
