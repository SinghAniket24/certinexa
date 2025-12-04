import React, { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile() {
  const [orgDetails, setOrgDetails] = useState({
    organizationName: "",
    officialEmail: "",
    verification_status: "",
    contactNumber: "",
    organizationAddress: "",
    createdAt: ""
  });

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("org_details") || "{}");

  if (saved && Object.keys(saved).length > 0) {
    setOrgDetails({
      organizationName: saved.name || "Not Available",
      officialEmail: saved.email || "Not Available",
      verification_status: saved.status || "pending",
      contactNumber: saved.contactNumber || "Not Available",
      organizationAddress: saved.organizationAddress || "Not Available",
      createdAt: saved.createdAt
        ? saved.createdAt.substring(0, 10)
        : "Not Available"
    });
  }
}, []);



  return (
    <div className="pf-wrap">
      <h2 className="pf-title">Organization Profile</h2>

      <div className="pf-profile-card">

        <div className="pf-row">
          <span className="pf-label">Organization Name</span>
          <span className="pf-value">{orgDetails.organizationName}</span>
        </div>

        <div className="pf-row">
          <span className="pf-label">Email</span>
          <span className="pf-value">{orgDetails.officialEmail}</span>
        </div>

        <div className="pf-row">
          <span className="pf-label">Status</span>
          <span
            className={`pf-value pf-status ${
              orgDetails.verification_status.toLowerCase()
            }`}
          >
            {orgDetails.verification_status}
          </span>
        </div>

        <div className="pf-row">
          <span className="pf-label">Contact</span>
          <span className="pf-value">{orgDetails.contactNumber}</span>
        </div>

        <div className="pf-row">
          <span className="pf-label">Address</span>
          <span className="pf-value">{orgDetails.organizationAddress}</span>
        </div>

        <div className="pf-row">
          <span className="pf-label">Registered On</span>
          <span className="pf-value">{orgDetails.createdAt}</span>
        </div>

      </div>
    </div>
  );
}
