import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous error
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/organization/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // login successful
        navigate("/dashboard"); // redirect to dashboard or desired page
      } else {
        // show error message
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error. Please try later.");
    }
  };

  return (
    <div className="login-digital-wrapper">

      {/* TOP LEFT LOGO TEXT */}
      <div className="certinexa-logo">CertiNexa</div>

      {/* LEFT DIGITAL LOGIN CARD */}
      <div className="digital-left">
        <div className="digital-card">

          <h1 className="digital-title">Sign In</h1>

          {errorMessage && <p className="login-error-msg">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="digital-form">

            <div className="digital-input-box">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="digital-input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="digital-login-btn">
              Login
            </button>

            <p className="forgot-link">Forgot Password?</p>
          </form>

        </div>
      </div>

      {/* RIGHT DIGITAL GLASS PANEL */}
      <div className="digital-right">
        <div className="right-glass-box">
          <h2>Secure Login for CertiNexa Team</h2>
          <p>Enter your details and start your journey with CertiNexa.</p>

          <button
            className="digital-signup-btn"
            onClick={() => navigate("/organization/register")}
          >
            Create Account
          </button>

        </div>
      </div>
    </div>
  );
}
