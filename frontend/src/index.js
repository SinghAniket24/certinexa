import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// import App from './App';

//  Current page you want to view
//import Register from './organization/register';
import RecipientAuth from './recepient/Auth/RecepientAuth';
//import AdminDashboard from './admin/pages/AdminDashboard'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    {/* Replace this component anytime to view other pages */}
    <RecipientAuth/>

    {/* <App />  // ← uncomment this to go back to App.js */}

  </React.StrictMode>
);

