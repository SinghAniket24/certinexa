import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab = 'dashboard', setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('admin');

    // 
    navigate('/admin/login', { replace: true });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <div className="logo-icon">C</div>
        <span className="text-xl font-bold tracking-wide">CertiNexa</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab && setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

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