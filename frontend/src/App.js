import React from "react";
import { FaCertificate, FaUserGraduate, FaCheckCircle } from "react-icons/fa";
import "./App.css";
import { useNavigate, Routes, Route } from "react-router-dom";

// --- Imports ---
import Login from "./organization/login";
import RecepientLogin from "./recepient/login";  
import VerifierPortal from "./verification/verifier";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import OrganizationDashboard from "./organization/organization_dashboard";

// --- FIX 1: Import the Dashboard correctly ---
// Based on your screenshot, the file is RecipientDashboard.jsx inside the 'recepient' folder
import RecipientDashboard from "./recepient/RecipientDashboard";
import RecipientRegister from "./recepient/register";

export default function App() {

  const navigate = useNavigate();

  const handleCardClick = (role) => {
    console.log("Card clicked:", role);

    if (role === "issuer") {
      navigate("/organization/login");
    } else if (role === "recepient") { 
      navigate("/recepient/login");
    } else if (role === "verifier") {
      navigate("/verification/verifier");
    }

  };

  return (
    <>
      <Routes>
        {/* Home Page (Your existing Landing Page) */}
        <Route
          path="/"
          element={
            <div className="page">

              <header className="banner">
                CertiNexa – Blockchain Certificate System
              </header>

              <div className="cards-wrapper">

                <div
                  className="role-card issuer"
                  onClick={() => handleCardClick("issuer")}
                >
                  <FaCertificate className="card-icon" />
                  <h2>Issuer Portal</h2>
                  <p>Issue and manage blockchain-secured digital certificates for your organization.</p>
                </div>

                <div
                  className="role-card recepient"
                  onClick={() => handleCardClick("recepient")}
                >
                  <FaUserGraduate className="card-icon" />
                  <h2>Recipient Portal</h2>
                  <p>Access, download, and share your verified digital certificates in one place.</p>
                </div>

                <div
                  className="role-card verifier"
                  onClick={() => handleCardClick("verifier")}
                >
                  <FaCheckCircle className="card-icon" />
                  <h2>Verifier Portal</h2>
                  <p>Instantly verify certificate authenticity using blockchain-backed validation.</p>
                </div>

              </div>

            </div>
          }
        />

        {/* --- EXISTING ROUTES --- */}
        <Route path="/organization/login" element={<Login />} />
        <Route path="/recepient/login" element={<RecepientLogin />} />
        <Route path="/verification/verifier" element={<VerifierPortal />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
        <Route path="/organization_dashboard" element={<OrganizationDashboard />} />
        <Route path="/recepient/register" element={<RecipientRegister />} />
        
        {/* --- FIX 2: Added the Missing Dashboard Route --- */}
        {/* This matches the URL you redirect to in login.jsx */}
        <Route path="/recepient/dashboard" element={<RecipientDashboard />} />

      </Routes>
    </>
  );
}