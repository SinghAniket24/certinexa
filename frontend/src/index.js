import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App';
import Login from './organization/login';
import Register from './organization/register';
// import Register from './recepient/register';
// import AdminDashboard from './admin/pages/AdminDashboard';
// import AdminAuth from './admin/pages/AdminAuth';

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

        {/* Add more later if needed */}
        
      </Routes>

    </BrowserRouter>
{/* 
  <register/> */}
  </React.StrictMode>
);
