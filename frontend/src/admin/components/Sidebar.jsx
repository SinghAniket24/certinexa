import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// IMPORT EXTERNAL CSS
import '../styles/variables.css';
import '../styles/Sidebar.css';

// Added default value 'dashboard' to activeTab to ensure it is always highlighted by default
const Sidebar = ({ activeTab = 'dashboard', setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the stored data
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    
    // Redirect to the Admin Login page
    navigate('/admin'); 
  };

  // Only Dashboard remains in the menu
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="sidebar-container">
      {/* Logo Area */}
      <div className="sidebar-logo">
        <div className="logo-icon">C</div>
        <span className="text-xl font-bold tracking-wide">CertiNexa</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab && setActiveTab(item.id)}
            // Since activeTab defaults to 'dashboard', this condition is true by default
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;