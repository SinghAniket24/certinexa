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
import OrganizationDashboard from './organization/organization_dashboard'; 

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
        <Route path="organization/organization_dashboard" element={<OrganizationDashboard />} /> 
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
