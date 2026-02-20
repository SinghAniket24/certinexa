import React, { useState } from "react";
import "./org_register.css";
export default function OrganizationRegister() {
  const [organizationName, setOrganizationName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [orgType, setOrgType] = useState("");
  const [customType, setCustomType] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialPhone, setOfficialPhone] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [verificationDocument, setVerificationDocument] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const finalOrgType = orgType === "Other" && customType ? customType : orgType;

    const orgData = {
      organizationName,
      registrationNumber,
      organizationType: finalOrgType,
      customType,
      officialEmail,
      officialPhone,
      walletAddress,
      verificationDocument,
      organizationAddress,
      password,
      confirmPassword,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/organization/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Organization registered successfully! You will receive a mail once verified.");
        setOrganizationName("");
        setRegistrationNumber("");
        setOrgType("");
        setCustomType("");
        setOfficialEmail("");
        setOfficialPhone("");
        setWalletAddress("");
        setVerificationDocument("");
        setOrganizationAddress("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="reg-wrapper">
      <div className="top-header">
        <h1 className="page-title">Organization Registration</h1>
        <p className="page-desc">
          Create your official account to begin issuing secure blockchain-verified certificates using CertiNexa.
        </p>
      </div>

      <div className="admin-note">
        Your organization will be reviewed by our verification team.
        You’ll receive an email once it is approved, after which you can start issuing certificates.
      </div>

      {message && (
        <div className="success-popup">
          {message}
        </div>
      )}

      <div className="reg-containers">
        <h2 className="reg-headings">Register Your Organization</h2>
        <p className="reg-sub-text">
          Enter accurate information to help us verify your organization smoothly.
        </p>

        <form className="reg-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="field">
              <label>Organization Name</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Registration / License Number</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
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
                  required
                />
              </div>
            )}
          </div>

          <div className="row">
            <div className="field">
              <label>Official Email</label>
              <input
                type="email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Official Phone Number</label>
              <input
                type="text"
                value={officialPhone}
                onChange={(e) => setOfficialPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Verification Document URL</label>
              <input
                type="url"
                value={verificationDocument}
                onChange={(e) => setVerificationDocument(e.target.value)}
                required
              />
              <small className="note">Add a drive/IPFS link</small>
            </div>
          </div>

          <div className="field full">
            <label>Organization Address</label>
            <textarea
              value={organizationAddress}
              onChange={(e) => setOrganizationAddress(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="reg-btn" type="submit">
            Register
          </button>


          <div className="login-redirect-box">
            Already have an account?{" "}
            <span className="login-redirect-link" onClick={() => window.location.href = "/organization/login"}>
              Login here
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}