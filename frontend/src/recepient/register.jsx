import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiCpu } from "react-icons/fi";
import "./register.css";

const RecipientRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering:", formData);
  };

  return (
    <div className="reg-main">
      <div className="brand-logo">CertiNexa</div>

      <div className="reg-container">
        <div className="reg-card">
          <h2 className="reg-title">Create Your Recipient Account</h2>
          <p className="reg-subtitle">
            Securely access blockchain-verified certificates through CertiNexa.
          </p>

          {/* FORM */}
          <form className="reg-form" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Wallet Address */}
            <div className="form-group">
              <label className="form-label">
                Wallet Address <span style={{ color: "#64748B" }}>(Optional)</span>
              </label>
              <div className="input-wrapper">
                <FiCpu className="input-icon teal-icon" />
                <input
                  type="text"
                  name="walletAddress"
                  className="form-input input-wallet"
                  placeholder="0x..."
                  value={formData.walletAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Create Account
            </button>
          </form>

          <p className="toggle-text">
            Already have an account? 
            <Link to="/recipient/login" className="toggle-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipientRegister;