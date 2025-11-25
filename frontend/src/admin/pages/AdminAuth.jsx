import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/AdminAuth.css'; 

const AdminAuth = () => {
  const navigate = useNavigate(); 
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    walletAddress: '', 
    role: 'Support'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Ensure this port matches your backend
    const BASE_URL = 'http://localhost:5000/api/admin';
    const endpoint = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/register`;

    try {
      console.log(`📡 Sending request to: ${endpoint}`); // DEBUG LOG

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        // --- LOGIN SUCCESS ---
        console.log("✅ Login Successful. Token received."); // DEBUG LOG
        
        // 1. Store Data
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        
        // 2. Redirect
        console.log("🔄 Attempting redirect to /admin/dashboard..."); // DEBUG LOG
        
        // 'replace: true' prevents going back to login page via back button
        navigate('/admin/dashboard', { replace: true });
        
      } else {
        // --- REGISTER SUCCESS ---
        alert("Registration Successful! Please login.");
        toggleMode(); 
      }

    } catch (err) {
      console.error("❌ Auth Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      walletAddress: '',
      role: 'Support'
    });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>CertiNexa <span className="highlight">Admin</span></h2>
          <p>{isLogin ? 'Secure Access Portal' : 'Onboard New Administrator'}</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            padding: '10px', 
            borderRadius: '6px',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="admin@certinexa.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
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

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Wallet Address (Blockchain)</label>
                <input
                  type="text"
                  name="walletAddress"
                  className="form-input wallet-field" 
                  placeholder="0x..."
                  value={formData.walletAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Support">Support</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Register Admin')}
          </button>
        </form>

        <div className="toggle-text">
          {isLogin ? "New to the team?" : "Already have an account?"}
          <span onClick={toggleMode} className="toggle-link">
            {isLogin ? "Create ID" : "Login Here"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;