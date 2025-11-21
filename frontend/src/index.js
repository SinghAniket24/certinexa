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

// <-- add this import (adjust path if needed)
import VerifierPortal from './verification/verifier';

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

        {/* Verifier route (added) */}
        <Route path="/verification/verifier" element={<VerifierPortal />} />

        {/* Add more later if needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
