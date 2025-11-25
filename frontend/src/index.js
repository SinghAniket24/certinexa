// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App';
import Login from './organization/login';
import Register from './organization/register';
import RecipientLogin from './recepient/login';
import RecipientRegister from './recepient/register';
import VerifierPortal from './verification/verifier';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/pages/AdminLogin';
import AdminSignup from './admin/pages/AdminSignup';

// 👇 1. IMPORT YOUR NEW ADMIN COMPONENT
// (Make sure this path matches where you saved the file. 
// If it's in a folder named 'admin', use './admin/AdminAuth')

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<App />} />

        {/* Organization Auth */}
        <Route path="/organization/login" element={<Login />} />
        <Route path="/organization/register" element={<Register />} />

        {/* Recipient Auth */}
        <Route path="/recepient/login" element={<RecipientLogin />} />
        <Route path="/recepient/register" element={<RecipientRegister />} />

        {/* Verifier */}
        <Route path="/verification/verifier" element={<VerifierPortal />} />

        {/* --- Admin Auth --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminSignup />} />

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

    </BrowserRouter>
  </React.StrictMode>
);