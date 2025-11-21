import React, { useState } from 'react';
import './register.css'; 

const RecipientAuth = () => {
  // State to toggle between Login and Register
  const [isLogin, setIsLogin] = useState(true);

  // Single state object for form data
  const [formData, setFormData] = useState({
    recipientId: '',
    name: '',
    email: '',
    password: '',
    walletAddress: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in with:", { 
        email: formData.email, 
        password: formData.password 
      });
      // Add your Login API logic here
    } else {
      console.log("Registering with:", formData);
      // Add your Register API logic here
    }
  };

  // Toggle view and reset sensitive fields
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      recipientId: '',
      name: '',
      email: '',
      password: '',
      walletAddress: ''
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? 'Recipient Login' : 'New Recipient'}
        </h2>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Access your credentials securely' 
            : 'Join CertiNexa to manage your certificates'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          
          {/* REGISTRATION ONLY FIELDS */}
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Recipient ID</label>
                <input
                  type="text"
                  name="recipientId"
                  className="form-input input-id"
                  placeholder="e.g. STU-2025-001"
                  value={formData.recipientId}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </>
          )}

          {/* COMMON FIELDS (Email & Password) */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
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
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* REGISTRATION ONLY FIELD (Wallet) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Wallet Address</label>
              <input
                type="text"
                name="walletAddress"
                className="form-input input-wallet"
                placeholder="0x..."
                value={formData.walletAddress}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? 'Login to Dashboard' : 'Register Account'}
          </button>
        </form>

        <div className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="toggle-link">
            {isLogin ? 'Create one' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipientAuth;