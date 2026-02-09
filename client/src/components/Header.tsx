import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MeDropdown from './MeDropdown';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    if (path === '/') {
      navigate('/');
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">💼</span>
          <span className="logo-text">PartnerHub</span>
        </div>
        <nav className="header-nav">
          <button 
            className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => handleNavClick('/')}
          >
            Home
          </button>
          <button className="nav-btn">Network</button>
          <button className="nav-btn">Jobs</button>
          <button className="nav-btn">Messages</button>
        </nav>
        <div className="header-actions">
          <MeDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
