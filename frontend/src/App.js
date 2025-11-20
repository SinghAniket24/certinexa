import React from "react";
import { FaCertificate, FaUserGraduate, FaCheckCircle } from "react-icons/fa";
import "./App.css";
import { useNavigate, Routes, Route } from "react-router-dom";
import Login from "./organization/login";   // make sure this path is correct

export default function App() {

  const navigate = useNavigate();

  const handleCardClick = (role) => {
    console.log("Card clicked:", role);

    if (role === "issuer") {
      navigate("/organization/login");
    }
  };

  return (
    <>
      {/* ROUTES */}
      <Routes>
        {/* Home Page */}
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
                  className="role-card recipient"
                  onClick={() => handleCardClick("recipient")}
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

        {/* LOGIN PAGE ROUTE */}
        <Route path="/organization/login" element={<Login />} />
      </Routes>
    </>
  );
}
