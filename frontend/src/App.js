import React from "react";
import {
  FaCertificate,
  FaUserGraduate,
  FaCheckCircle,
  FaShieldAlt,
  FaBolt,
  FaLink
} from "react-icons/fa";
import "./App.css";
import { useNavigate, Routes, Route, Link } from "react-router-dom";

// Imports
import Login from "./organization/login";
import RecepientLogin from "./recepient/login";
import VerifierPortal from "./verification/verifier";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import OrganizationDashboard from "./organization/organization_dashboard";
import Chatbot from "./chatbot/Chatbot";
import RecipientDashboard from "./recepient/RecipientDashboard";
import RecipientRegister from "./recepient/register";

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* NAVBAR */}
              <nav className="navbar">
                <div className="nav-logo">CertiNexa</div>
                <div className="nav-links">
                  <a href="#roles">Portals</a>
                  <a href="#features">Features</a>
                  <a href="#how">How it Works</a>
                </div>
              </nav>

              <div className="page">
                {/* HERO */}
                <section className="hero">
                  <h1>
                    Digital Certificates,
                    <span> Secured by Blockchain</span>
                  </h1>
                  <p>
                    Issue, manage, and verify tamper-proof digital certificates
                    using a transparent and decentralized system.
                  </p>
                </section>

                {/* ROLE NAVIGATION */}
                <section id="roles" className="section">
                  <h2 className="section-title">Choose Your Portal</h2>

                  <div className="role-grid">
                    <div
                      className="role-card issuer"
                      onClick={() => navigate("/organization/login")}
                    >
                      <FaCertificate />
                      <h3>Issuer</h3>
                      <p>
                        Organizations issue and manage certificates with
                        blockchain-backed integrity.
                      </p>
                    </div>

                    <div
                      className="role-card recipient"
                      onClick={() => navigate("/recepient/login")}
                    >
                      <FaUserGraduate />
                      <h3>Recipient</h3>
                      <p>
                        Securely access, download, and share your verified
                        certificates.
                      </p>
                    </div>

                    <div
                      className="role-card verifier"
                      onClick={() => navigate("/verification/verifier")}
                    >
                      <FaCheckCircle />
                      <h3>Verifier</h3>
                      <p>
                        Instantly verify certificate authenticity without manual
                        checks.
                      </p>
                    </div>
                  </div>
                </section>

                {/* FEATURES */}
                <section id="features" className="section light">
                  <h2 className="section-title">Why CertiNexa</h2>

                  <div className="feature-grid">
                    <div className="feature-card">
                      <FaShieldAlt />
                      <h4>Fraud Resistant</h4>
                      <p>
                        Blockchain storage prevents certificate tampering or
                        forgery.
                      </p>
                    </div>

                    <div className="feature-card">
                      <FaBolt />
                      <h4>Instant Verification</h4>
                      <p>
                        Validate certificates within seconds using secure
                        cryptographic hashes.
                      </p>
                    </div>

                    <div className="feature-card">
                      <FaLink />
                      <h4>Decentralized Trust</h4>
                      <p>
                        No dependency on manual verification or issuing bodies.
                      </p>
                    </div>
                  </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how" className="section">
                  <h2 className="section-title">How It Works</h2>

                  <div className="steps">
                    <div className="step-card">
                      <span>1</span>
                      <p>Issuer uploads and issues a certificate</p>
                    </div>
                    <div className="step-card">
                      <span>2</span>
                      <p>Certificate hash is recorded on blockchain</p>
                    </div>
                    <div className="step-card">
                      <span>3</span>
                      <p>Recipient accesses certificate securely</p>
                    </div>
                    <div className="step-card">
                      <span>4</span>
                      <p>Verifier validates authenticity instantly</p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          }
        />

        <Route path="/organization/login" element={<Login />} />
        <Route path="/recepient/login" element={<RecepientLogin />} />
        <Route path="/verification/verifier" element={<VerifierPortal />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/organization_dashboard" element={<OrganizationDashboard />} />
        <Route path="/recepient/register" element={<RecipientRegister />} />
        <Route path="/recepient/dashboard" element={<RecipientDashboard />} />
      </Routes>

      <Chatbot />
    </>
  );
} 