import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <span className="logo-icon">💼</span>
          <span className="logo-text">PartnerHub</span>
        </div>
        <nav className="header-nav">
          <button className="nav-btn active">Home</button>
          <button className="nav-btn">Network</button>
          <button className="nav-btn">Jobs</button>
          <button className="nav-btn">Messages</button>
        </nav>
        <div className="header-actions">
          {user && (
            <div className="user-info">
              <span className="user-name">{user.name}</span>
            </div>
          )}
          <button className="action-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
