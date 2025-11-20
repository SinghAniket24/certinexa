import React, { useState } from "react";
import "./register.css";

export default function OrganizationRegister() {
  const [orgType, setOrgType] = useState("");
  const [customType, setCustomType] = useState("");

  return (
    <div className="reg-wrapper">

      {/* ===== HEADER SECTION ===== */}
      <div className="top-header">
        <h1 className="page-title">Organization Registration</h1>
        <p className="page-desc">
          Create your official account to begin issuing secure blockchain-verified certificates using CertiNexa.
        </p>
      </div>

      {/* ===== ADMIN REVIEW NOTE ===== */}
      <div className="admin-note">
        Your organization will be reviewed by our verification team.
        You’ll receive an email once it is approved, after which you can start issuing certificates.
      </div>

      {/* ===== FORM CONTAINER ===== */}
      <div className="reg-container">

        <h2 className="reg-heading">Register Your Organization</h2>
        <p className="reg-sub-text">
          Enter accurate information to help us verify your organization smoothly.
        </p>

        <form className="reg-form">

          <div className="row">
            <div className="field">
              <label>Organization Name</label>
              <input type="text" required />
            </div>

            <div className="field">
              <label>Registration / License Number</label>
              <input type="text" />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Organization Type</label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="School">School</option>
                <option value="College">College / University</option>
                <option value="Company">Company</option>
                <option value="EdTech">EdTech Platform</option>
                <option value="Other">Other (Custom)</option>
              </select>
            </div>

            {orgType === "Other" && (
              <div className="field">
                <label>Custom Type</label>
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="row">
            <div className="field">
              <label>Official Email</label>
              <input type="email" required />
            </div>

            <div className="field">
              <label>Official Phone Number</label>
              <input type="text" required />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Wallet Address</label>
              <input type="text" />
            </div>

            <div className="field">
              <label>Verification Document URL</label>
              <input type="url" required />
              <small className="note">Add a drive/IPFS link</small>
            </div>
          </div>

          <div className="field full">
            <label>Organization Address</label>
            <textarea required></textarea>
          </div>

          <div className="row">
            <div className="field">
              <label>Password</label>
              <input type="password" required />
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <input type="password" required />
            </div>
          </div>

          <button className="reg-btn" type="submit">Register</button>

        </form>
      </div>
    </div>
  );
}
