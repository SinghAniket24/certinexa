// src/recipient/Auth/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import './login.css';

const RecipientLogin = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recepient/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return setMessage(data.message || "Login failed");
      }

      // Save token
      localStorage.setItem("recepientToken", data.token);

      setMessage("Login successful! Redirecting...");

      // 3. Navigate to Dashboard (1 second delay for UX)
      setTimeout(() => {
        navigate("/recepient/dashboard");
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage("Server error, please try again.");
    }
  };

  return (
    <div className="login-main">

      <div className="brand-logo">Certinexa</div>

      <div className="login-container">
        <div className="login-card">

          <h2 className="login-title">Recipient Login</h2>
          <p className="login-subtitle">Access your certifications securely</p>

          {message && <p className="status-text">{message}</p>}

          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Login</button>

            <p className="toggle-text">
              Don’t have an account?
              <Link className="toggle-link" to="/recepient/register"> Create one</Link>
            </p>

          </form>

        </div>
      </div>
    </div>
  );
};

export default RecipientLogin;