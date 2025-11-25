import React from 'react';
import { LayoutDashboard, Users, FileCheck, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
// IMPORT EXTERNAL CSS
import '../styles/variables.css';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate(); // 2. Initialize the hook

  // 3. Define the Logout Function
  const handleLogout = () => {
    // Clear the stored data
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    
    // Redirect to the Admin Login page (or Home)
    navigate('/admin'); 
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'organizations', label: 'Organizations', icon: <Users size={20} /> },
    { id: 'certificates', label: 'Certificates', icon: <FileCheck size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
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
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        {/* 4. Attach the click handler here */}
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;