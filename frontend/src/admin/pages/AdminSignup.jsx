import React, { useState } from "react";
import "../styles/AdminSignup.css";

const AdminSignup = ({ onSwitchPage }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    walletAddress: "",
    role: "Support"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup Failed");

      alert("Registration Successful! Please login.");
      onSwitchPage();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>Create Admin Account</h2>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Wallet Address</label>
            <input
              name="walletAddress"
              className="form-input wallet-field"
              placeholder="0x..."
              value={formData.walletAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Support">Support</option>
              <option value="SuperAdmin">SuperAdmin</option>
            </select>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Processing..." : "Register Admin"}
          </button>
        </form>

        <p className="toggle-text" onClick={onSwitchPage}>
          Already have an account? <span className="toggle-link">Login</span>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
